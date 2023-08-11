const getChannelById = (channels, id) => channels.find((c) => c.id === id);

const getCurrentChannel = (state) => state.channels.entities
  .find((channel) => channel.id === state.channels.currentChannelId);

const getCurrentMessages = (state) => state.messages.entities
  .filter((message) => message.channelId === getCurrentChannel(state).id);

const getCurrentModal = (state) => state.modals.type;

const getModalData = (state) => state.modals.data;

const getChannels = (state) => state.channels.entities.map((channel) => channel.name);

export {
  getChannelById, getCurrentChannel, getCurrentMessages, getModalData, getCurrentModal, getChannels,
};
