import Head from 'next/head';
import { signout, useSession } from 'next-auth/client';
import { Button } from '@chakra-ui/react';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  const [session, loading] = useSession();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome!</h1>
        <pre> {session && JSON.stringify(session, null, 2)}</pre>
        {!session && (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
        {session && (
          <Button
            onClick={() =>
              signout({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` })
            }
          >
            Logout
          </Button>
        )}
      </main>
    </div>
  );
}
