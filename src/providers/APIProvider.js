import React from 'react';
import * as api from './api.js';
import { SocketAPIContext } from '../contexts';

const APIProvider = ({ socket, children }) => {
  // eslint-disable-next-line max-len
  // TODO: такая реализация APIProvider'а не является отпимальной: было бы лучше если бы он прелдоставлял просто api без связи со состоянием, а состоянием оперировал только reducer
  // дополнительно это избавит от дополнительноых перерисовок самого провайдера.
  // TODO: изменение состояния выполнять по подписке, передавать сокет
  // eslint-disable-next-line max-len
  // TODO: кажется этого недостаточно: по идее другой пользователь может не только отправить сообщение, но а так же переименовать канал или удалить его.
  // eslint-disable-next-line max-len
  // т.е. изменение состояния должно происходить только при ответе в сервера о новом состоянии, а не при локальном действии пользователя.

  const createMessage = ({ body, channelId, username }) => {
    api.createMessage(socket, { body, channelId, username });
  };
  // TODO: api лучше вынести отдельно не привязывая жестко с redux или реакт.
  // к тому же после исправления первого комментария оно и не нужно будет.

  const createChannel = ({ name }) => {
    api.createChannel(socket, { name }, () => {
    });
  };

  const removeChannel = (id) => {
    api.removeChannel(socket, id);
    // TODO: Как вынести хуки из компонента (нужно ли выносить)
  };

  const renameChannel = ({ id, name }) => {
    api.renameChannel(socket, { id, name });
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
