/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const initialMessagesState = {
  entities: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    addMessage(state, action) {
      const {
        id, body, channelId, username,
      } = action.payload;
      state.entities[id] = {
        id, body, channelId, username,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      state.entities = state.entities.filter((message) => message.channelId !== channelId);
    });
    builder.addCase(channelsActions.initChannels, (state, action) => {
      const { messages } = action.payload;
      state.entities = messages;
    });
  },
});

export const { reducer, actions } = messagesSlice;
export default reducer;
