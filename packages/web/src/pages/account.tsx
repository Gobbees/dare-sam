import * as React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { Box, Button, Spinner, Text } from '@chakra-ui/react';
import { AiFillFacebook } from 'react-icons/ai';
import { UserContext } from '../context/UserContext';
import { User } from '../types/types';
import {
  getFacebookLongLivedToken,
  getFacebookAccessToken,
} from '../app/api/facebook-tokens';

const AccountPage = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const { user, setUser } = React.useContext(UserContext);
  const [state, setState] = React.useState(false);
  React.useEffect(() => {
    if (session && !loading) {
      fetch('/api/user', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => setUser(data as User));
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
      <ul>
        {user?.facebookPages.map((fbPage) => (
          <li>{fbPage.name}</li>
        ))}
      </ul>
      <Button
        leftIcon={<AiFillFacebook />}
        colorScheme="blue"
        isLoading={state}
        onClick={async () => {
          setState(true);
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
          setState(false);
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
