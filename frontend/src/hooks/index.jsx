import { useContext } from 'react';

import {AuthContext, ChannelModalContext, SocketAPIContext} from '../contexts/index.jsx';

const useAuth = () => useContext(AuthContext);
const useSocketAPI = () => useContext(SocketAPIContext);

export {
    useAuth,
    useSocketAPI,
};