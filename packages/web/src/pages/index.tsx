import { getSession } from 'next-auth/client';
import { NextPageContext } from 'next';

export default function Home() {
  /* no-op since getServerSideProps will always redirect */
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  };
}
