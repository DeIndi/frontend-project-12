import { useContext } from 'react';

import { AuthContext, SocketAPIContext } from '../contexts';

const useAuth = () => useContext(AuthContext);
const useSocketAPI = () => useContext(SocketAPIContext);

export {
  useAuth,
  useSocketAPI,
};
