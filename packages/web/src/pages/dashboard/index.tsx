import { Flex, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useQuery } from 'react-query';
import { FacebookPost } from '../../../../database/src';
import fetchFacebookPostsForPage from '../../app/api/facebook/facebook-posts';
import PostTable from '../../components/dashboard/PostTable';
import useUser from '../../hooks/UseUser';

const DashboardPage = () => {
  const router = useRouter(); // TODO extract this in something like withAuth(Component)
  const { user, loading } = useUser();

  React.useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const { data } = useQuery<FacebookPost[]>('facebook-posts', () =>
    fetchFacebookPostsForPage(user?.facebookPages),
  );

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (!user) {
    return <h2>Redirecting...</h2>;
  }

  return (
    <Flex flexDir="column" align="center" h="100%">
      <Flex flexDir="column" maxW="7xl" align="center">
        {data && (
          <PostTable
            posts={data.map((post) => ({
              id: post.id,
              message: post.message,
              likeCount: post.likeCount,
              url: `https://facebook.com/${post.id}`,
            }))}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default DashboardPage;
