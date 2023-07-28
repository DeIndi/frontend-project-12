import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';
import modalsReducer from './slices/modalsSlice';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modals: modalsReducer,
  },
});

export default store;
