import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import useUser from '../../hooks/UseUser';

const DashboardPage = () => {
  const router = useRouter(); // TODO extract this in something like withAuth(Component)
  const { user, loading } = useUser();

  React.useEffect(() => {
    if (!user && !loading) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  return user ? (
    <div>
      Hello, {user.name}. This is your empty dashboard. It's beautiful, isn't
      it?
    </div>
  ) : (
    <h2>Redirecting...</h2>
  );
};

export default DashboardPage;
