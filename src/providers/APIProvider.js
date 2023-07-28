import React from 'react';
import * as api from './api.js';
import { SocketAPIContext } from '../contexts';

const APIProvider = ({ socket, children }) => {
  const createMessage = ({ body, channelId, username }) => {
    api.createMessage(socket, { body, channelId, username });
  };

  const createChannel = ({ name }) => {
    api.createChannel(socket, { name }, () => {
    });
  };

  const removeChannel = (id) => {
    api.removeChannel(socket, id);
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
