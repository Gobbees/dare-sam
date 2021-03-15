import { Box, Flex, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react-web';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import Navbar from '../../components/common/Navbar';
import DashboardTable from '../../components/dashboard/DashboardTable';
import RedirectingPage from '../../components/RedirectingPage';
import useUser from '../../hooks/UseUser';
import emptyBoxAnimation from '../../../public/animations/sad-empty-box.json';

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
      <VStack spacing={4} align="center">
        <Lottie
          options={{ animationData: emptyBoxAnimation }}
          title="Sad empty box"
          width={200}
          height={200}
        />
        <Text textAlign="center">
          Uh oh, you don't have any profiles. Link them through the{' '}
          <NextLink href="/account">
            <Link fontWeight="bold" color="purple.600">
              Account
            </Link>
          </NextLink>{' '}
          page.
        </Text>
      </VStack>
    );
  }
  return (
    <Box minW="full" minH="screen">
      <Head>
        <title>Dashboard | DARE-SAM</title>
      </Head>
      <Navbar />
      <Box pt={24}>{content}</Box>
    </Box>
  );
};

export default DashboardPage;
