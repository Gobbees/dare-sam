import { Session, useSession } from 'next-auth/client';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { useQuery } from 'react-query';
import { UserContext } from '../context/UserContext';
import { User } from '../types';

interface UseUserResult {
  user?: User;
  loading: boolean;
  session: Session | null | undefined;
  setUser: (user: User) => void;
  errorState?: Error;
}

interface UseUserState {
  isLoading: boolean;
  errorState?: Error;
}

const useUser = (): UseUserResult => {
  const [session, isSessionLoading] = useSession();
  const { user, setUser } = React.useContext(UserContext);
  const [state, setState] = React.useState<UseUserState>({
    isLoading: isSessionLoading || !user,
  });
  const { data, status, error } = useQuery(
    'user',
    async () => {
      const response = await fetch('/api/user');
      return response.json();
    },
    {
      enabled: !!session && !isSessionLoading,
    },
  );
  React.useEffect(() => {
    if (data && status !== 'error') {
      ReactDOM.unstable_batchedUpdates(() => {
        // to avoid two rerenders
        setUser(data as User);
        setState({ errorState: undefined, isLoading: false });
      });
    } else if (!data && status === 'error') {
      setState({ isLoading: false, errorState: error as Error });
    } else if (!session && !isSessionLoading) {
      setState({
        isLoading: false,
        errorState: new Error('Missing Authentication'),
      });
    }
  }, [session, isSessionLoading, data, status, error, setUser, setState]);

  return {
    user,
    session,
    loading: state.isLoading,
    setUser,
    errorState: state.errorState,
  };
};

export default useUser;
