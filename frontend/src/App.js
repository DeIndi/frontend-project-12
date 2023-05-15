import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './components/Login';
import Chat from './components/Chat';
import ErrorPage from './components/ErrorPage';
import { useState } from "react";
import AuthContext from "./contexts";
import { Provider } from 'react-redux'
import 'bootstrap';
import store from "./store";

const AuthProvider = ({ children }) => {
    const localUserData = JSON.parse(localStorage.getItem('userData'));
    const [userData, setUserData] = useState(localUserData??null);
    const loggedIn = !!userData;
    const getAuthHeader = () => {
        if (userData?.token) {
            return { Authorization: `Bearer ${userData.token}` };
        }
        return {};
    };
    const logIn = (userData) => {
        setUserData(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    const logOut = () => {
        localStorage.removeItem('userId');
        setUserData(null);
    };
    return (
        <AuthContext.Provider value={{ loggedIn, logIn, logOut, getAuthHeader, userData }}>
            {children}
        </AuthContext.Provider>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Chat />,
        errorElement: <ErrorPage />,
    },
    {
        path: "login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
]);

function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <h1 className="App">Main Page</h1>
                <RouterProvider router={router}/>
            </AuthProvider>
        </Provider>
    );
}

export default App;
