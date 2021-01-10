import * as React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { FaFacebookF } from 'react-icons/fa';
import { signin } from 'next-auth/client';

const LoginPage = () => (
  <Flex flexDir="column" py={96} alignItems="center" justifyContent="center">
    <Button
      colorScheme="facebook"
      leftIcon={<FaFacebookF />}
      onClick={() =>
        signin('facebook', {
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        })
      }
    >
      Login with Facebook
    </Button>
  </Flex>
);
export default LoginPage;
