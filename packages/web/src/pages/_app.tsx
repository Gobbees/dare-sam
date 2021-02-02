import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultUserValue, UserContext } from '../context/UserContext';
import { User } from '../types/types';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [userInfo, setUserInfo] = React.useState<User | undefined>(
    defaultUserValue.user,
  );

  return (
    <NextAuthProvider session={pageProps.session}>
      <ChakraProvider>
        <UserContext.Provider value={{ user: userInfo, setUser: setUserInfo }}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </UserContext.Provider>
      </ChakraProvider>
    </NextAuthProvider>
  );
}

export default MyApp;
