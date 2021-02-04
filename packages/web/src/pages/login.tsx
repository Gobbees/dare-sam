import * as React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import { signin } from 'next-auth/client';

const LoginPage = () => (
  <VStack
    spacing={4}
    flexDir="column"
    py={96}
    alignItems="center"
    justifyContent="center"
  >
    <Button
      w={64}
      colorScheme="facebook"
      leftIcon={<FaFacebookF />}
      onClick={() =>
        signin('facebook', {
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        })
      }
    >
      Login with Facebook
    </Button>
    <Button
      w={64}
      colorScheme="twitter"
      leftIcon={<FaTwitter />}
      onClick={() =>
        signin('twitter', {
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        })
      }
    >
      Login with Twitter
    </Button>
  </VStack>
);
export default LoginPage;
