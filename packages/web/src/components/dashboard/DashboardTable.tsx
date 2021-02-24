import { Flex, Link, Text, VStack } from '@chakra-ui/react';
import { subDays } from 'date-fns';
import Lottie from 'lottie-react-web';
import * as React from 'react';
import fetchPosts from '../../app/api/posts';
import { Post, User } from '../../types';
import PostTable from './PostTable';
import IntervalSelector from './IntervalSelector';
import SocialSelector from './SocialSelector';
import workingAnimation from '../../../public/animations/working.json';

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
      {posts.length ? (
        <PostTable posts={posts} {...state.sourcesStatus} />
      ) : (
        <VStack spacing={4} align="center">
          <Lottie
            options={{ animationData: workingAnimation }}
            title="Sad empty box"
            width={200}
            height={200}
          />
          <Text textAlign="center" fontSize="lg">
            Uh oh, the social profiles you linked don't seem to have any posts.
            This can be our problem, though. <br />
            In fact, we update your amazing posts once every hour, so it is
            possible that this is our fault. <br />
            Please wait some more time or, if you believe this is an error,
            contact us at{' '}
            <Link href="mailto:gobbees@gmail.com" color="purple.600">
              gobbees@gmail.com
            </Link>
          </Text>
        </VStack>
      )}
    </Flex>
  );
};

export default DashboardTable;
