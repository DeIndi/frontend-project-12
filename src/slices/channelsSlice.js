/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// import { actions as messagesActions } from './messagesSlice';

const initialChannelsState = {
  ids: [], entities: [], currentChannelId: 0,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState: initialChannelsState,
  reducers: {
    initChannels(state, action) {
      state.entities = action.payload;
    },
    updateCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addChannel(state, action) {
      const { id, name } = action.payload;
      state.entities.push({ id, name, removable: true });
      state.ids.push(id);
    },
    removeChannel(state, action) {
      const channelId = action.payload;
      state.entities = state.entities.filter((channel) => channel.id !== channelId);
      state.ids = state.ids.filter((id) => id !== channelId);
    },
    renameChannel(state, action) {
      const { id, name } = action.payload;
      const channelToRename = state.entities.find((channel) => channel.id === id);
      if (channelToRename) {
        console.dir('channel to rename:', channelToRename);
        channelToRename.name = name;
      }
    },
  },
  /* extraReducers: (builder) => {
    builder.addCase(messagesActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      remove(state.entities, (message) => message.channelId === channelId);
    });
  }, */
});

export const getCurrentChannelId = (state) => state.currentChannelId;

export const { reducer, actions } = channelsSlice;
export default reducer;
