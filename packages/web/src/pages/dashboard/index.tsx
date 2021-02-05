import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import PostTable from '../../components/dashboard/PostTable';
import RedirectingPage from '../../components/RedirectingPage';
import useUser from '../../hooks/UseUser';

const DashboardPage = () => {
  const router = useRouter(); // TODO extract this in something like withAuth(Component)
  const { user, loading } = useUser();

  React.useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  if (loading) {
    return <Spinner></Spinner>;
  }

  if (!user) {
    return <RedirectingPage />;
  }
  // TODO explain that the comment count can be different from the actual comments we show because
  // empty comments are not saved in the system
  return user.facebookPage ? (
    <Flex flexDir="column" align="center">
      <Text fontWeight="extrabold" fontSize="5xl">
        Posts
      </Text>
      <Flex flexDir="column" maxW="7xl" align="center">
        <PostTable page={user.facebookPage} />
      </Flex>
    </Flex>
  ) : (
    <Flex flexDir="column" align="center">
      Uh oh, you don't have any Facebook Pages. Link them through the account
      page.
    </Flex>
  );
};

export default DashboardPage;
