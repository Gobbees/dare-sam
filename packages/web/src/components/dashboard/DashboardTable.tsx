import { Flex } from '@chakra-ui/react';
import { subDays } from 'date-fns';
import * as React from 'react';
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

  React.useEffect(() => {
    fetchPosts({
      isFacebookSelected: state.sourcesStatus.facebookSelected,
      isInstagramSelected: state.sourcesStatus.instagramSelected,
      fromDate: state.fromDate,
      sinceDate: state.sinceDate,
    }).then((newPosts) => {
      setPosts(newPosts);
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
      <PostTable posts={posts} {...state.sourcesStatus} />
    </Flex>
  );
};

export default DashboardTable;
