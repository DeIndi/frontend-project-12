import { useContext } from 'react';

import { AuthContext, SocketAPIContext } from '../contexts';

const useAuth = () => useContext(AuthContext);
const useAPI = () => useContext(SocketAPIContext);

export {
  useAuth,
  useAPI,
};
