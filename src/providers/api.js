export const createMessage = (socket, { body, channelId, username }) => {
  socket.emit('newMessage', { body, channelId, username }, (response) => new Promise((resolve) => {
    resolve(response);
  }));
};

export const createChannel = (socket, { name }) => {
  socket.emit('newChannel', { name }, (response) => new Promise((resolve) => {
    resolve(response.data.id);
  }));
};

export const removeChannel = (socket, id) => {
  socket.emit('removeChannel', { id }, (response) => new Promise((resolve) => {
    resolve(response);
  }));
};

export const renameChannel = (socket, { id, name }) => {
  socket.emit('renameChannel', { id, name }, (response) => new Promise((resolve) => {
    resolve(response);
  }));
};
