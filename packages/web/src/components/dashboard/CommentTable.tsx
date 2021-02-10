import {
  Flex,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Sentiment } from '@crystal-ball/common';
import { format } from 'date-fns';
import React from 'react';
import { BiComment, BiLike } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { Column, useTable } from 'react-table';
import fetchCommentsByPost from '../../app/api/comments';
import { Comment } from '../../types';
import SentimentEmoji from '../common/SentimentEmoji';

interface CommentTableProps {
  postId: string;
}

interface CommentTableColumns {
  publishedDate: Date;
  message?: string;
  permalink?: string;
  likeCount: number;
  repliesCount: number;
  sentiment?: Sentiment;
}

const CommentTable: React.FC<CommentTableProps> = (
  props: CommentTableProps,
) => {
  const { data, status } = useQuery<Comment[]>(props.postId, () =>
    fetchCommentsByPost(props.postId),
  );
  console.log(data?.map((comm) => comm.sentiment));
  const { columns, tableData } = useTableData(data || []);
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
  } = useTable({ columns, data: tableData });
  if (status === 'loading') {
    return <Spinner></Spinner>;
  }
  if (!data) {
    return (
      <>
        Uh oh, we encountered an unexpected error. Please close the row and try
        again
      </>
    );
  }
  if (data?.length === 0) {
    return (
      <>
        Uh oh, we don't have any comment for this post. This is probably because
        the comments you received only contain pictures. To verify this, please
        click on the post link.
      </>
    );
  }
  return (
    <Table w="full" {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <React.Fragment key={row.id}>
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            </React.Fragment>
          );
        })}
      </Tbody>
    </Table>
  );
};

const useTableData = (comments: Comment[]) => {
  const columns = React.useMemo<Array<Column<CommentTableColumns>>>(
    () => [
      {
        Header: 'Published Date',
        accessor: 'publishedDate',
        Cell: ({ value }) => (
          <Flex align="center">
            <Text>{format(new Date(value), 'PPP')}</Text>
          </Flex>
        ),
      },
      {
        Header: 'Message',
        accessor: 'message',
        Cell: ({ value }) => (
          <Flex w="2xl">
            <Text maxW="2xl">{value}</Text>
          </Flex>
        ),
      },
      {
        Header: 'Link',
        accessor: 'permalink',
        Cell: ({ value }) => {
          if (value) {
            return (
              <Link href={value} color="blue.400">
                <Flex flexDir="row" align="center" maxW={64}>
                  View <br />
                  comment
                </Flex>
              </Link>
            );
          }
          return null;
        },
      },
      {
        Header: 'Like Count',
        accessor: 'likeCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiLike} w={5} h={5} /> {value}
          </Text>
        ),
      },
      {
        Header: 'Replies Count',
        accessor: 'repliesCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiComment} w={5} h={5} /> {value}
          </Text>
        ),
      },
      {
        Header: 'Sentiment',
        accessor: 'sentiment',
        Cell: ({ value }) => (
          <Flex align="center">
            {!value && value !== 0 ? (
              <Text>No sentiment detected</Text>
            ) : (
              <SentimentEmoji sentiment={value} extraStyles={{ w: 6, h: 6 }} />
            )}
          </Flex>
        ),
      },
    ],
    [],
  );
  const tableData = React.useMemo<Array<CommentTableColumns>>(
    () => comments.map((comment) => ({ ...comment })),
    [comments],
  );
  return { columns, tableData };
};

export default CommentTable;
