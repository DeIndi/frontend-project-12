import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { actions as messagesActions } from '../slices/messagesSlice';
import { actions as channelsActions } from '../slices/channelsSlice';
import { SocketAPIContext } from '../contexts';

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
        }}
        >
            {children}
        </SocketAPIContext.Provider>
    );
};

export default SocketAPIProvider;
