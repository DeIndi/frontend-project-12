/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialChannelsState = {
  entities: [], currentChannelId: 1,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState: initialChannelsState,
  reducers: {
    initChannels(state, action) {
      const { channels } = action.payload;
      state.entities = channels;
    },
    updateCurrentChannelId(state, action) {
      state.currentChannelId = action.payload;
    },
    addChannel(state, action) {
      const { id, name } = action.payload;
      state.entities.push({ id, name, removable: true });
    },
    removeChannel(state, action) {
      const channelId = action.payload;
      state.entities = state.entities.filter((channel) => channel.id !== channelId);
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
});

export const { reducer, actions } = channelsSlice;
export default reducer;
