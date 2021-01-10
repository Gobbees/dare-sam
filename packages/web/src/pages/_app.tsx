import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultUserValue, UserContext } from '../context/UserContext';
import { User } from '../types/types';

function MyApp({ Component, pageProps }: AppProps) {
  const [userInfo, setUserInfo] = React.useState<User | undefined>(
    defaultUserValue.user,
  );

  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <UserContext.Provider value={{ user: userInfo, setUser: setUserInfo }}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
