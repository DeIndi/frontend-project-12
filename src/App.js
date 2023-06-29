import {
  createBrowserRouter,
  RouterProvider,

  Navigate,
  useLocation,
} from 'react-router-dom';
import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { server } from 'websocket';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HeaderNavbar from './components/HeaderNavbar';
import Chat from './components/Chat';
import ErrorPage from './components/ErrorPage';
import { AuthContext, SocketAPIContext } from './contexts';
import 'bootstrap';
import store from './store';
import { actions as channelsActions } from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import resources from './locales/index.js';
import { useAuth } from './hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const localUserData = JSON.parse(localStorage.getItem('userData'));
  const [userData, setUserData] = useState(localUserData ?? null);
  const loggedIn = !!userData;
  const getAuthHeader = () => {
    if (userData?.token) {
      return { Authorization: `Bearer ${userData.token}` };
    }
    return {};
  };
  const logIn = (usrData) => {
    setUserData(usrData);
    localStorage.setItem('userData', JSON.stringify(usrData));
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };
  return (
        <AuthContext.Provider value={{
          loggedIn, logIn, logOut, getAuthHeader, userData,
        }}>
            {children}
        </AuthContext.Provider>
  );
};

/* const socketServer = 'http://localhost:5001'; */

const SocketAPIProvider = ({ socket, children }) => {
  const dispatch = useDispatch();
  const currChannelId = useSelector((state) => state.channels.currentChannelId);
  socket.on('newMessage', (payload) => {
    const {
      body, channelId, id, username,
    } = payload;
    dispatch(messagesActions.addMessage({
      body, channelId, id, username,
    }));
  });
  const createMessage = ({ body, channelId, username }) => {
    socket.emit(
      'newMessage',
      { body, channelId, username },
      () => {
      },
    );
  };
  const createChannel = ({ name }) => {
    socket.emit('newChannel', { name }, (response) => {
      console.log('response after create Channel: ', response);
      dispatch(channelsActions.addChannel({ id: response.data.id, name }));
      dispatch(channelsActions.updateCurrentChannelId(response.data.id));
    });
  };
  const removeChannel = (id) => {
    socket.emit('removeChannel', { id });
    dispatch(channelsActions.removeChannel(id));
    if (currChannelId === id) {
      dispatch(channelsActions.updateCurrentChannelId(1));
    }
  };

  const renameChannel = ({ id, name }) => {
    socket.emit('renameChannel', { id, name });
    dispatch(channelsActions.renameChannel({ id, name }));
  };

  return (
        <SocketAPIContext.Provider value={{
          createMessage, createChannel, removeChannel, renameChannel,
        }}>
            {children}
        </SocketAPIContext.Provider>
  );
};

// TODO: вынести сокет провайдер

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element:
            <PrivateRoute>
                <Chat/>
            </PrivateRoute>,
    errorElement: <ErrorPage/>,
  },
  {
    path: 'login',
    element: <Login/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: 'signup',
    element: <SignUp/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '*',
    element: <ErrorPage/>,
    errorElement: <ErrorPage/>,
  },
]);

const init = async () => {
  const clientSocket = io(server);
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });
  console.log('i18 init: ', i18n);
  return (
        <React.StrictMode>
        <I18nextProvider i18n={i18n} >
        <Provider store={store}>
            <AuthProvider>
                <SocketAPIProvider socket={clientSocket}>
                    <HeaderNavbar/>
                    <RouterProvider
                        router={router}
                        fallbackElement={<ErrorPage />}
                    />
                    <ToastContainer />
                </SocketAPIProvider>
            </AuthProvider>
        </Provider>
        </I18nextProvider>
        </React.StrictMode>
  );
};

export default init;
