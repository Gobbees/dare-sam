import { Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { subDays } from 'date-fns';
import * as React from 'react';
import ReactDOM from 'react-dom';
import fetchPosts from '../../app/api/posts';
import { Post, User } from '../../types';
import PostTable from './PostTable';
import IntervalSelector from './IntervalSelector';
import SocialSelector from './SocialSelector';

interface DashboardTableProps {
  user: User;
}

interface DashboardTableState {
  fromDate: Date;
  sinceDate: Date;
  sourcesStatus: {
    facebookSelected: boolean;
    instagramSelected: boolean;
  };
}

const DashboardTable: React.FC<DashboardTableProps> = ({
  user,
}: DashboardTableProps) => {
  const defultState: DashboardTableState = {
    // TODO change it to 30
    fromDate: subDays(new Date(), 6000), // fetches posts not older than 30 days by default
    sinceDate: new Date(), // now
    sourcesStatus: {
      facebookSelected: !!user.facebookPage,
      instagramSelected: !!user.instagramProfile,
    },
  };
  const [state, setState] = React.useState<DashboardTableState>(defultState);
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [postLoading, setPostLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setPostLoading(true);
    fetchPosts({
      isFacebookSelected: state.sourcesStatus.facebookSelected,
      isInstagramSelected: state.sourcesStatus.instagramSelected,
      fromDate: state.fromDate,
      sinceDate: state.sinceDate,
    }).then((newPosts) => {
      ReactDOM.unstable_batchedUpdates(() => {
        setPosts(newPosts);
        setPostLoading(false);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.fromDate, state.sinceDate]);
  return (
    <Flex flexDir="column" maxW="full" align="center">
      <Flex flexDir="row" w="7xl" align="center" justify="space-around">
        <IntervalSelector
          startValue={state.fromDate}
          onStartValueChange={(date: Date) =>
            setState({ ...state, fromDate: date })
          }
          endValue={state.sinceDate}
          onEndValueChange={(date: Date) => {
            if (date > state.fromDate) {
              setState({ ...state, sinceDate: date });
            }
          }}
        />
        <SocialSelector
          user={user}
          facebookSelected={state.sourcesStatus.facebookSelected}
          instagramSelected={state.sourcesStatus.instagramSelected}
          onFacebookSelect={() =>
            setState({
              ...state,
              sourcesStatus: {
                ...state.sourcesStatus,
                facebookSelected: !state.sourcesStatus.facebookSelected,
              },
            })
          }
          onInstagramSelect={() =>
            setState({
              ...state,
              sourcesStatus: {
                ...state.sourcesStatus,
                instagramSelected: !state.sourcesStatus.instagramSelected,
              },
            })
          }
        />
      </Flex>
      {postLoading && <Spinner />}
      {!!posts.length && !postLoading && (
        <PostTable posts={posts} {...state.sourcesStatus} />
      )}
      {!posts.length && !postLoading && (
        <Text textAlign="center" fontSize="lg" p={4}>
          Uh oh, the social profiles you linked don't seem to have any posts.
          <br />
          Try changing the date interval and check that you have published posts
          on them. <br />
          This could also be our problem, though. <br />
          In fact, we update your amazing posts once every hour, so it is
          possible that our update service hasn't run yet. <br />
          Please wait some more time or, if you believe this is an error,
          contact us at{' '}
          <Link href="mailto:gobbees@gmail.com" color="purple.600">
            gobbees@gmail.com
          </Link>
        </Text>
      )}
    </Flex>
  );
};

export default DashboardTable;
