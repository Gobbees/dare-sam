import * as React from 'react';
import { User } from '../types';

interface IUserContext {
  user: User | undefined;
  setUser: (user: User) => void;
}

const defaultUserValue: IUserContext = {
  user: undefined,
  setUser: () => {},
};

const UserContext = React.createContext<IUserContext>(defaultUserValue);

export { UserContext, defaultUserValue };
