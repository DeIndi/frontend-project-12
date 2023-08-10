import { useContext } from 'react';

import { AuthContext, APIContext } from '../contexts';

const useAuth = () => useContext(AuthContext);
const useAPI = () => useContext(APIContext);

export {
  useAuth,
  useAPI,
};
