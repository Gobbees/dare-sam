import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signout } from 'next-auth/client';
import { useMutation } from 'react-query';
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Link,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import useUser from '../hooks/UseUser';
import RedirectingPage from '../components/RedirectingPage';
import ProfilesConnector from '../components/account/ProfilesConnector';
import YourProfilesSection from '../components/account/YourProfiles';
import ProfilesSelector from '../components/account/ProfilesSelector';
import { SocialProfile } from '../types';
import Navbar from '../components/common/Navbar';

interface AccountPageState {
  profilesState?: {
    facebookPage?: SocialProfile;
    instagramProfile?: SocialProfile;
  };
  fbAccessToken?: string;
  facebookChecked: boolean;
  instagramChecked: boolean;
}

const DEFAULT_ACCOUNT_PAGE_STATE: AccountPageState = {
  facebookChecked: true,
  instagramChecked: true,
};

const AccountPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { user, loading } = useUser();
  const [state, setState] = React.useState<AccountPageState>(
    DEFAULT_ACCOUNT_PAGE_STATE,
  );
  const facebookTokenMutation = useMutation(
    async (token: string) =>
      fetch('/api/facebook/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, isLongLived: false }),
      }),
    {
      onMutate: () => {
        toast({
          status: 'info',
          description: 'Updating the Facebook token...',
          position: 'bottom-right',
        });
      },
      onSuccess: () => {
        toast({
          status: 'success',
          description: 'Updated',
          position: 'bottom-right',
        });
      },
    },
  );

  React.useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    if (user) {
      setState({
        ...state,
        profilesState: {
          facebookPage: user.facebookPage,
          instagramProfile: user.instagramProfile,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setState]);

  if (loading) {
    return <Spinner></Spinner>;
  }
  if (!user) {
    return <RedirectingPage />;
  }

  return (
    <Box minW="full" minH="screen">
      <Head>
        <title>Account | Crystal Ball</title>
      </Head>
      <Navbar />
      <Box pt={24}>
        <Flex
          flexDir="column"
          px={{ base: 10, lg: 60 }}
          py={10}
          alignItems={{ base: 'center', lg: 'start' }}
        >
          <Divider py={3} />
          <Text fontSize="2xl" fontWeight="bold">
            Your Linked Social Netork profiles
          </Text>
          <YourProfilesSection user={user} />
          <Divider py={3} />
          <Text fontSize="2xl" fontWeight="bold">
            Connect your Social Network profiles
          </Text>
          <ProfilesConnector
            facebookEnabled={!state.profilesState?.facebookPage}
            instagramEnabled={!state.profilesState?.instagramProfile}
            onFacebookConnected={(
              token: string,
              facebookSelected: boolean,
              instagramSelected: boolean,
            ) => {
              setState({
                ...state,
                fbAccessToken: token,
                facebookChecked: facebookSelected,
                instagramChecked: instagramSelected,
              });
              facebookTokenMutation.mutate(token);
            }}
          />
          {state.fbAccessToken && (
            <ProfilesSelector
              fbAccessToken={state.fbAccessToken}
              displayFacebook={
                state.facebookChecked && !state.profilesState?.facebookPage
              }
              displayInstagram={
                state.instagramChecked && !state.profilesState?.instagramProfile
              }
            />
          )}
          <Divider my={3} />
          <HStack spacing={3}>
            <Button onClick={() => signout({ callbackUrl: '/login' })}>
              Logout
            </Button>
            <Link href="mailto:gobbees@gmail.com" color="gray.600">
              Contact us ✉️
            </Link>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default AccountPage;
