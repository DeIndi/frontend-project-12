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
      const { channels, currentChannelId } = action.payload;
      state.entities = channels;
      state.currentChannelId = currentChannelId;
    },
    updateCurrentChannelId(state, action) {
      console.log('action payload: ', action.payload);
      state.currentChannelId = action.payload;
    },
    addChannel(state, action) {
      const { id, name } = action.payload;
      state.entities.push({ id, name, removable: true });
    },
    removeChannel(state, action) {
      console.log('action: ', action);
      const id = action.payload;
      if (state.currentChannelId === id) {
        state.currentChannelId = 1;
      }
      state.entities = state.entities.filter((channel) => channel.id !== id);
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
