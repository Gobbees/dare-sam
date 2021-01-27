import { Session, useSession } from 'next-auth/client';
import * as React from 'react';
import ReactDOM from 'react-dom';
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

  React.useEffect(() => {
    if (session && !isSessionLoading && !user) {
      console.log('fetching user');
      fetch('/api/user', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          ReactDOM.unstable_batchedUpdates(() => {
            // to avoid two rerenders
            setUser(data as User);
            setState({ errorState: undefined, isLoading: false });
          });
        })
        .catch((error) =>
          setState({ isLoading: false, errorState: error as Error }),
        );
    }
  }, [session, isSessionLoading, user, state, setUser, setState]);

  return {
    user,
    session,
    loading: state.isLoading,
    setUser,
    errorState: state.errorState,
  };
};

export default useUser;
