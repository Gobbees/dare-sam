import {
  Button,
  Flex,
  HStack,
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
import { format } from 'date-fns';
import * as React from 'react';
import { AiFillFacebook } from 'react-icons/ai';
import { BiComment, BiLike, BiShare } from 'react-icons/bi';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { Column, useExpanded, useTable } from 'react-table';
import CommentTable from './CommentTable';
import { fetchFacebookPostsForPage } from '../../app/api/facebook';
import { FacebookPage, FacebookPost } from '../../types';

interface PostTableProps {
  page: FacebookPage;
}

interface PostTableColumns {
  publishedDate: Date;
  message?: string;
  url: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
}

const PostTable: React.FC<PostTableProps> = (props: PostTableProps) => {
  const { data, status } = useQuery<FacebookPost[]>('facebook-posts', () =>
    fetchFacebookPostsForPage(props.page),
  );

  const { columns, tableData } = useTableData(data || []);

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
    toggleAllRowsExpanded,
    visibleColumns,
  }: any = useTable(
    {
      columns,
      data: tableData,
    },
    useExpanded,
  );
  // any because toggleAllRowsExpanded doesn't exist in the basic TableInstance.

  if (status === 'loading') {
    return <Spinner></Spinner>;
  }
  if (!data) {
    return <>Uh oh, your page doesn't have any post yet</>;
  }

  return (
    <>
      <HStack spacing={4}>
        <Button onClick={() => toggleAllRowsExpanded(false)}>
          Close all comments tabs
        </Button>
        <Button onClick={() => toggleAllRowsExpanded(true)}>
          Open all comments tabs
        </Button>
      </HStack>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup: any) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  ))}
                </Tr>
                {row.isExpanded ? (
                  <Tr>
                    <Td colSpan={visibleColumns.length}>
                      <Flex flexDir="column" align="center">
                        <Text fontWeight="extrabold">Comments</Text>
                        <Flex flexDir="column" align="center">
                          <CommentTable postId={data[row.index].id} />
                        </Flex>
                      </Flex>
                    </Td>
                  </Tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

const useTableData = (posts: FacebookPost[]) => {
  const columns = React.useMemo<Array<Column<PostTableColumns>>>(
    () => [
      {
        id: 'rowExpander',
        Cell: ({ row }: any) => (
          <>
            {row.values.commentsCount !== 0 && (
              <Flex
                align="center"
                justify="center"
                w={8}
                h={8}
                {...row.getToggleRowExpandedProps()}
              >
                <Icon as={row.isExpanded ? IoChevronUp : IoChevronDown} />
              </Flex>
            )}
          </>
        ),
      },
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
          <Flex w={64}>
            <Text isTruncated maxW="2xl">
              {value}
            </Text>
          </Flex>
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
        accessor: 'likesCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiLike} w={5} h={5} /> {value}
          </Text>
        ),
      },
      {
        Header: 'Shares Count',
        accessor: 'sharesCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiShare} w={5} h={5} /> {value}
          </Text>
        ),
      },
      {
        Header: 'Comments Count',
        accessor: 'commentsCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiComment} w={5} h={5} /> {value}
          </Text>
        ),
      },
    ],
    [],
  );
  const tableData = React.useMemo<Array<PostTableColumns>>(
    () =>
      posts.map((post) => ({
        publishedDate: post.publishedDate,
        message: post.message,
        url: `https://facebook.com/${post.id}`,
        likesCount: post.likesCount,
        sharesCount: post.sharesCount,
        commentsCount: post.commentsCount,
      })),
    [posts],
  );
  return { columns, tableData };
};

export default PostTable;
