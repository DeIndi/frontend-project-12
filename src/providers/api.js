export const createMessage = (socket, { body, channelId, username }) => new Promise(
  (resolve) => {
    socket.emit('newMessage', { body, channelId, username }, (response) => {
      resolve(response);
    });
  },
);

export const createChannel = (socket, { name }) => new Promise(
  (resolve) => socket.emit('newChannel', { name }, resolve),
);

export const removeChannel = (socket, id) => new Promise(
  (resolve) => socket.emit('removeChannel', { id }, resolve),
);

export const renameChannel = (socket, { id, name }) => new Promise(
  (resolve) => socket.emit('renameChannel', { id, name }, resolve),
);
