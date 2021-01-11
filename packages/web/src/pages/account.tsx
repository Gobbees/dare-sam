import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { AiFillFacebook } from 'react-icons/ai';
import { UserContext } from '../context/UserContext';
import { FacebookPage, User } from '../types/types';
import {
  getFacebookLongLivedToken,
  getFacebookAccessToken,
} from '../app/api/facebook-tokens';
import getFacebookPagesForProfile from '../app/api/facebook-pages';
import PageSelector from '../components/account/PageSelector';

const AccountPage = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const { user, setUser } = React.useContext(UserContext);
  React.useEffect(() => {
    if (session && !loading) {
      fetch('/api/user', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          const resUser: User = data;
          setUser(resUser);
        });
    }
  }, [session, loading, setUser]);

  React.useEffect(() => {
    if (!(session || loading)) {
      router.replace('/login');
    }
  }, [session, loading, router]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  return session ? (
    <Box maxW="6xl" p={60}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Text fontSize="xl">Your Facebook pages</Text>
      {user?.facebookPages && <PageSelector pages={user.facebookPages} />}
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
  ) : (
    <h1>Redirecting</h1>
  );
};

export default AccountPage;
