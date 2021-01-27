import { Session, useSession } from 'next-auth/client';
import * as React from 'react';
import { UserContext } from '../context/UserContext';
import { User } from '../types';

interface UseUserResult {
  user?: User;
  loading: boolean;
  session: Session | null | undefined;
  setUser: (user: User) => void;
  errorState?: Error;
}

const useUser = (): UseUserResult => {
  const [session, loading] = useSession();
  const { user, setUser } = React.useContext(UserContext);
  const [errorState, setErrorState] = React.useState<Error | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (session && !loading && !user) {
      fetch('/api/user', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => setUser(data as User))
        .catch((error) => setErrorState(error as Error));
    }
  }, [session, loading, user, setUser, setErrorState]);

  return { user, session, loading, setUser, errorState };
};

export default useUser;
