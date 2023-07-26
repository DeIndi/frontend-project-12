import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HeaderNavbar from './components/HeaderNavbar';
import Chat from './components/Chat';
import ErrorPage from './components/ErrorPage';
import AuthProvider from './providers/AuthProvider';
import 'bootstrap';
import store from './store';
import resources from './locales/index.js';
import { useAuth } from './hooks';
import SocketAPIProvider from './providers/SocketAPIProvider';

const loginPath = '/login';
const PrivateRoute = () => {
  const auth = useAuth();
  const location = useLocation();
  return (
    // TODO: кореектнее было бы использовать Outlet для отрисовни дочерних элементов (fixed)
    // пути так же было бы классно вынести в константы — там сильно удобнее их рефакторить (fixed)
    auth.loggedIn ? <Outlet /> : <Navigate to={loginPath} state={{ from: location }} />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element:
  <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'signup',
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);

const init = async (clientSocket) => {
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
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AuthProvider>
            <SocketAPIProvider socket={clientSocket}>
              <HeaderNavbar />
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
