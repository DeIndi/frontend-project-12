import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './components/Login';
import Chat from './components/Chat';
import ErrorPage from './components/ErrorPage';
import { useState } from "react";
import { AuthContext, SocketAPIContext } from "./contexts";
import { Provider } from 'react-redux'
import 'bootstrap';
import store from "./store";
import { io } from "socket.io-client";
import {server } from "websocket";
import { actions as channelsActions } from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { useDispatch, useSelector } from 'react-redux';

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

const socketServer = 'http://localhost:5001';

const SocketAPIProvider = ({ socket, store, children }) => {
    const dispatch = useDispatch();
    const currChannelId = useSelector(state => state.channels.currentChannelId);
    const createMessage = ({body, channelId, username}) => {
        socket.emit('newMessage', {body, channelId, username},
            () => {
                socket.on('newMessage', (payload) => {
                    const {id} = payload;
                    dispatch(messagesActions.addMessage({ body, channelId, id, username }));
                    }
                );
        });
    }
    const createChannel= ({ name }) => {
        socket.emit('newChannel', { name }, (response) => {
            console.log('response after create Channel: ', response);
            dispatch(channelsActions.addChannel({ id: response.data.id, name }));
            dispatch(channelsActions.updateCurrentChannelId(response.data.id));
        });
    }
    const removeChannel = ( id ) => {
        socket.emit('removeChannel', { id });
        dispatch(channelsActions.removeChannel( id ));
        if (currChannelId === id) {
            dispatch(channelsActions.updateCurrentChannelId(1));
        }
    }

    const renameChannel = ({id, name} ) => {
        socket.emit('renameChannel', { id, name});
        dispatch(channelsActions.renameChannel({ id, name }));
    }
    return (
        <SocketAPIContext.Provider value={{ createMessage, createChannel, removeChannel, renameChannel }}>
            {children}
        </SocketAPIContext.Provider>
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
    const clientSocket = io(server);
    return (
        <Provider store={store}>
            <AuthProvider>
                <SocketAPIProvider socket={clientSocket}>
                    <RouterProvider router={router}/>
                </SocketAPIProvider>
            </AuthProvider>
        </Provider>
    );
}

export default App;
