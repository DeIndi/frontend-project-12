import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import * as api from './api.js';
import { actions as messagesActions } from '../slices/messagesSlice';
import { actions as channelsActions } from '../slices/channelsSlice';
import { SocketAPIContext } from '../contexts';

const APIProvider = ({ socket, children }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line max-len
  // TODO: такая реализация APIProvider'а не является отпимальной: было бы лучше если бы он прелдоставлял просто api без связи со состоянием, а состоянием оперировал только reducer
  // дополнительно это избавит от дополнительноых перерисовок самого провайдера.
  // TODO: изменение состояния выполнять по подписке, передавать сокет
  const currChannelId = useSelector((state) => state.channels.currentChannelId);
  // eslint-disable-next-line max-len
  // TODO: кажется этого недостаточно: по идее другой пользователь может не только отправить сообщение, но а так же переименовать канал или удалить его.
  // eslint-disable-next-line max-len
  // т.е. изменение состояния должно происходить только при ответе в сервера о новом состоянии, а не при локальном действии пользователя.
  useEffect(() => {
    const handleNewMessage = (payload) => {
      const {
        body, channelId, id, username,
      } = payload;
      dispatch(messagesActions.addMessage({
        body, channelId, id, username,
      }));
    };

    const handleNewChannel = (payload) => {
      console.log(payload);
    };

    const handleRemoveChannel = (payload) => {
      console.log(payload);
    };

    const handleRenameChannel = (payload) => {
      console.log(payload);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
    };
  }, [socket, dispatch]);

  const createMessage = ({ body, channelId, username }) => {
    api.createMessage(socket, { body, channelId, username });
  };
  // TODO: api лучше вынести отдельно не привязывая жестко с redux или реакт.
  // к тому же после исправления первого комментария оно и не нужно будет.

  const createChannel = ({ name }) => {
    api.createChannel(socket, { name }, (newChannelId) => {
      dispatch(channelsActions.addChannel({ id: newChannelId, name }));
      dispatch(channelsActions.updateCurrentChannelId(newChannelId));
    });
  };

  const removeChannel = (id) => {
    api.removeChannel(socket, id);
    dispatch(channelsActions.removeChannel(id));
    if (currChannelId === id) {
      dispatch(channelsActions.updateCurrentChannelId(1));
    }
    // TODO: Как вынести хуки из компонента (нужно ли выносить)
  };

  const renameChannel = ({ id, name }) => {
    api.renameChannel(socket, { id, name });
    dispatch(channelsActions.renameChannel({ id, name }));
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SocketAPIContext.Provider value={{
      createMessage, createChannel, removeChannel, renameChannel,
    }}
    >
      { children }
    </SocketAPIContext.Provider>
  );
};

export default APIProvider;
