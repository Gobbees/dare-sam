import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import Navbar from '../../components/common/Navbar';
import DashboardTable from '../../components/dashboard/DashboardTable';
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

  let content: React.ReactNode;
  if (loading) {
    content = (
      <Flex flexDir="column" align="center">
        <Spinner />
      </Flex>
    );
  } else if (!user) {
    return <RedirectingPage />;
  } else if (user.facebookPage || user.instagramProfile) {
    content = (
      <Flex flexDir="column" align="center">
        <Text fontWeight="extrabold" fontSize="5xl">
          Posts
        </Text>
        <DashboardTable user={user} />
      </Flex>
    );
  } else {
    content = (
      <Flex flexDir="column" align="center">
        Uh oh, you don't have any profiles. Link them through the
        <Link href="/account">account</Link>
        page.
      </Flex>
    );
  }
  return (
    <Box minW="full" minH="screen">
      <Head>
        <title>Dashboard | Crystal Ball</title>
      </Head>
      <Navbar />
      <Box pt={24}>{content}</Box>
    </Box>
  );
};

export default DashboardPage;
