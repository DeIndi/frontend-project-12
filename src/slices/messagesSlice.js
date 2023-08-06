/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const initialMessagesState = {
  ids: [],
  entities: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    initMessages(state, action) {
      state.entities = action.payload;
    },
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
      state.ids = state.ids.filter((id) => state.entities[id].channelId !== channelId);
    });
    builder.addCase(channelsActions.initChannels, (state, action) => {
      console.log('state from extra reducer (init):  ', state);
      console.log('action.payload from extra reducer (init): ', action.payload);
      const { messages } = action.payload;
      state.entities = messages;
      state.ids = messages.map((message) => message.id);
    });
  },
});

export const { reducer, actions } = messagesSlice;
export default reducer;
