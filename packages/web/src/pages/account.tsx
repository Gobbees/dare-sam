import * as React from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { AiFillFacebook } from 'react-icons/ai';
import { FacebookPage } from '../types';
import {
  getFacebookLongLivedToken,
  getFacebookAccessToken,
} from '../app/api/facebook/facebook-tokens';
import { getFacebookPagesForProfile } from '../app/api/facebook';
import PageSelector from '../components/account/PageSelector';
import useUser from '../hooks/UseUser';
import RedirectingPage from '../components/RedirectingPage';

const AccountPage = () => {
  const router = useRouter();
  const { user, loading, setUser } = useUser();

  console.log(user, loading);
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

  return (
    <Box maxW="6xl" p={60}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Text fontSize="xl">Your Facebook pages</Text>
      {user?.facebookPages && <PageSelector pages={user.facebookPages} />}
      {/* TODO extract this in another component */}
      <Button
        leftIcon={<AiFillFacebook />}
        colorScheme="blue"
        onClick={async () => {
          const at = await getFacebookAccessToken(true);
          console.log('Updating DB');
          await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facebookAccessToken: at!,
              isLongLivedToken: false,
            }),
          });
          console.log('Posted slt');
          const llt = await getFacebookLongLivedToken(at!);
          console.log(llt);
          await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              facebookAccessToken: at!,
              isLongLivedToken: true,
            }),
          });
          console.log('Posted llt');
          const pages = await getFacebookPagesForProfile(llt);
          console.log(pages);
          pages?.forEach(async (page) => {
            await fetch('/api/facebook/pages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                page,
              }),
            });
          });
          console.log('Posted pages');
          setUser({ ...user!, facebookPages: pages as FacebookPage[] });
        }}
      >
        Connect your Facebook Account
      </Button>
    </Box>
  );
};

export default AccountPage;
