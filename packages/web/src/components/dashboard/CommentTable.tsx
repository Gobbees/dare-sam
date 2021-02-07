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
import React from 'react';
import { AiFillFacebook } from 'react-icons/ai';
import { BiLike } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { Column, useTable } from 'react-table';
import { fetchFacebookCommentsForPost } from '../../app/api/facebook';
import { FacebookComment } from '../../types';
import SentimentEmoji from '../SentimentEmoji';

interface CommentTableProps {
  postId: string;
}

interface CommentTableColumns {
  message?: string;
  url: string;
  likeCount: number;
  overallSentiment?: Sentiment;
}

const CommentTable: React.FC<CommentTableProps> = (
  props: CommentTableProps,
) => {
  const { data, status } = useQuery<FacebookComment[]>(props.postId, () =>
    fetchFacebookCommentsForPost(props.postId),
  );
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
    <Table w="4xl" {...getTableProps()}>
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

const useTableData = (comments: FacebookComment[]) => {
  const columns = React.useMemo<Array<Column<CommentTableColumns>>>(
    () => [
      // {
      //   id: 'rowExpander',
      //   Cell: ({ row }: any) => (
      //     <Flex
      //       align="center"
      //       justify="center"
      //       w={8}
      //       h={8}
      //       {...row.getToggleRowExpandedProps()}
      //     >
      //       <Icon as={row.isExpanded ? IoChevronUp : IoChevronDown} />
      //     </Flex>
      //   ),
      // },
      {
        Header: 'Message',
        accessor: 'message',
        Cell: ({ value }) => (
          <Text isTruncated maxW="2xl">
            {value}
          </Text>
        ),
      },
      {
        Header: 'Link',
        accessor: 'url',
        Cell: ({ value }) => (
          <Link href={value}>
            <Flex flexDir="row" align="center" maxW={64}>
              View on <Icon as={AiFillFacebook} w={8} h={7} color="blue.600" />
            </Flex>
          </Link>
        ),
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
        Header: 'Sentiment',
        accessor: 'overallSentiment',
        Cell: ({ value }) => (
          <Flex align="center">
            {value ? (
              <SentimentEmoji sentiment={value} extraStyles={{ w: 6, h: 6 }} />
            ) : (
              <Text>No sentiment detected</Text>
            )}
          </Flex>
        ),
      },
    ],
    [],
  );
  const tableData = React.useMemo<Array<CommentTableColumns>>(
    () =>
      comments.map((comment) => ({
        message: comment.message,
        url: `https://facebook.com/${comment.id}`,
        likeCount: comment.likeCount,
        overallSentiment: comment.sentiment,
      })),
    [comments],
  );
  return { columns, tableData };
};

export default CommentTable;
