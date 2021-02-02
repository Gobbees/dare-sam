import {
  Flex,
  Icon,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import * as React from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { BiLike } from 'react-icons/bi';
import { Column, useExpanded, useTable } from 'react-table';

interface PostTableData {
  message?: string;
  likeCount: number;
  url: string;
  id: string;
}
interface PostTableProps {
  posts: Array<PostTableData>;
}

const useTableData = (posts: PostTableData[]) => {
  const columns = React.useMemo<Array<Column<PostTableData>>>(
    () => [
      {
        id: 'rowExpander',
        Cell: ({ row }: any) => (
          <Flex
            align="center"
            justify="center"
            w={8}
            h={8}
            {...row.getToggleRowExpandedProps()}
          >
            <Icon as={row.isExpanded ? IoChevronUp : IoChevronDown} />
          </Flex>
        ),
      },
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
            <BiLike />
          </Link>
        ),
      },
      {
        Header: 'Like Count',
        accessor: 'likeCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <BiLike />
            {value}
          </Text>
        ),
      },
    ],
    [],
  );
  const data = React.useMemo<Array<PostTableData>>(
    () =>
      posts.map((post) => ({
        id: post.id,
        message: post.message,
        url: `https://facebook.com/${post.id}`,
        likeCount: post.likeCount,
      })),
    [posts],
  );
  return { columns, data };
};

const PostTable: React.FC<PostTableProps> = (props: PostTableProps) => {
  const { columns, data } = useTableData(props.posts);
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
  } = useTable<PostTableData>(
    {
      columns,
      data,
    },
    useExpanded,
  );
  return (
    <Table {...getTableProps()}>
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
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default PostTable;
