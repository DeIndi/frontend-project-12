// TODO: базово селекторы зависят от состояния и являются чистыми фукциями

const getChannelById = (id) => (state) => state.channels.entities.find((c) => c.id === id);

const getCurrentChannel = (state) => state.channels.entities
  .find((channel) => channel.id === state.channels.currentChannelId);

const getCurrentMessages = (state) => state.messages.entities
  .filter((message) => message.channelId === state.channels.currentChannelId);

const getCurrentModal = (state) => state.modals;

const getChannelsNames = (state) => state.channels.entities.map((c) => c.name);

export {
  getChannelById,
  getCurrentChannel,
  getCurrentMessages,
  getCurrentModal,
  getChannelsNames,
};
