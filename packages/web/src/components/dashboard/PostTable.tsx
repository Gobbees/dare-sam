import {
  Button,
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
import { Source } from '@crystal-ball/common';
import { format } from 'date-fns';
import * as React from 'react';
import { BiComment, BiLike, BiShare } from 'react-icons/bi';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { Column, Row, useExpanded, useFilters, useTable } from 'react-table';
import { Post } from '../../types';
import SentimentEmoji from '../common/SentimentEmoji';
import SocialLogo from '../common/SocialLogo';
import CommentTable from './CommentTable';

interface PostTableProps {
  posts: Post[];
  facebookSelected: boolean;
  instagramSelected: boolean;
}

interface SourceFilter {
  facebookSelected: boolean;
  instagramSelected: boolean;
}

const PostTable: React.FC<PostTableProps> = (props: PostTableProps) => {
  const { columns, tableData } = useTableData(props.posts);

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
    setFilter,
    toggleAllRowsExpanded,
    visibleColumns,
  }: any = useTable(
    // any because toggleAllRowsExpanded doesn't exist in the basic TableInstance.
    {
      columns,
      data: tableData,
    },
    useFilters,
    useExpanded,
  );

  React.useEffect(() => {
    setFilter('source', {
      facebookSelected: props.facebookSelected,
      instagramSelected: props.instagramSelected,
    } as SourceFilter);
  }, [props.facebookSelected, props.instagramSelected, setFilter]);

  return (
    <>
      <Flex flexDir="column">
        <Button onClick={() => toggleAllRowsExpanded(false)}>
          Close all comments tabs
        </Button>
      </Flex>
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
                {row.isExpanded && (
                  <Tr>
                    <Td colSpan={visibleColumns.length}>
                      <Flex flexDir="column" align="center">
                        <Text fontWeight="extrabold">Comments</Text>
                        <Flex flexDir="column" align="center">
                          <CommentTable postId={tableData[row.index].id} />
                        </Flex>
                      </Flex>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};

// Custom source filter
const sourceFilter = (
  rows: Array<Row<Post>>,
  id: Array<string>,
  filterValue: SourceFilter,
) =>
  rows.filter(
    (row) =>
      (row.original.source === Source.Facebook &&
        filterValue.facebookSelected) ||
      (row.original.source === Source.Instagram &&
        filterValue.instagramSelected),
  );

const useTableData = (posts: Post[]) => {
  const columns = React.useMemo<Array<Column<Post>>>(
    () => [
      {
        id: 'rowExpander',
        Cell: ({ row }: any) => (
          <>
            {row.values.commentCount !== 0 && (
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
        accessor: 'source',
        Cell: ({ value }) => (
          <Flex align="center">
            <SocialLogo source={value} />
          </Flex>
        ),
        filter: sourceFilter,
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
        accessor: 'permalink',
        Cell: ({ value }) => (
          <Link href={value} color="blue.400">
            <Flex flexDir="row" align="center" maxW={64}>
              View post
            </Flex>
          </Link>
        ),
      },
      {
        Header: 'Post Sentiment',
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
      {
        Header: 'Comments Sentiment',
        accessor: 'commentsOverallSentiment',
        Cell: ({ value }) => {
          let textColor;
          if (!value && value !== 0) {
            textColor = 'black';
          } else if (value > 0) {
            textColor = 'green.500';
          } else if (value < 0) {
            textColor = 'red.500';
          } else {
            textColor = 'gray.500';
          }
          return (
            <Flex flexDir="row" align="center">
              <Text fontWeight="extrabold" color={textColor}>
                {!value && value !== 0 ? '/' : value.toFixed(2)}
              </Text>
            </Flex>
          );
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
        Header: 'Shares Count',
        accessor: 'shareCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiShare} w={5} h={5} /> {value}
          </Text>
        ),
      },
      {
        Header: 'Comments Count',
        accessor: 'commentCount',
        Cell: ({ value }) => (
          <Text display="inline-block">
            <Icon as={BiComment} w={5} h={5} /> {value}
          </Text>
        ),
      },
    ],
    [],
  );
  const tableData = React.useMemo<Array<Post>>(() => posts, [posts]); // table data must be memoized
  return { columns, tableData };
};

export default PostTable;
