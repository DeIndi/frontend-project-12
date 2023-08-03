/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { remove } from 'lodash';
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
      remove(state.entities, (message) => message.channelId === channelId);
    });
    /* builder.addCase(channelsActions.initChannels, (state, action) => {
      // const { channels, messages } = action.payload;
      console.log('state:  ', state);
      console.log('action.payload from messagesSlice: ', action.payload);
    }); */
  },
});

export const { reducer, actions } = messagesSlice;
export default reducer;
