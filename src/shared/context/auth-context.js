import { createContext } from 'react';

export const AuthContext = createContext({
  jwt: null,
  isLoggedIn: false,
  userData: {},
  login: () => {},
  logout: () => {},
});
