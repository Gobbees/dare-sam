import { Spinner } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import * as React from 'react';
import { UserContext } from '../../context/UserContext';
import { User } from '../../types';

const DashboardPage = () => {
  const router = useRouter(); // TODO extract this in something like withAuth(Component)
  const [session, loading] = useSession();
  const { user, setUser } = React.useContext(UserContext);
  React.useEffect(() => {
    if (session && !loading && !user) {
      fetch('/api/user', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          const resUser: User = data;
          setUser(resUser);
        });
    }
  }, [session, loading, user, setUser]);

  React.useEffect(() => {
    if (!user && !(session || loading)) {
      router.replace('/login');
    }
  }, [session, loading, user, router]);

  if (loading) {
    return <Spinner></Spinner>;
  }

  return session && user ? (
    <div>
      Hello, {user.name}. This is your empty dashboard. It's beautiful, isn't
      it?
    </div>
  ) : (
    <h2>Redirecting...</h2>
  );
};

export default DashboardPage;
