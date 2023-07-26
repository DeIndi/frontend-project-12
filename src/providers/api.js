export const createMessage = (socket, { body, channelId, username }) => {
  socket.emit('newMessage', { body, channelId, username }, () => {});
};

export const createChannel = (socket, { name }, onSuccess) => {
  socket.emit('newChannel', { name }, (response) => {
    onSuccess(response.data.id);
  });
};

export const removeChannel = (socket, id) => {
  socket.emit('removeChannel', { id });
};

export const renameChannel = (socket, { id, name }) => {
  socket.emit('renameChannel', { id, name });
};
