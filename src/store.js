import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';
import modalsReducer from './slices/modalsSlice';

// TODO: здесь стоит использовать redux-toolkit (fixed)
// TODO: вернуть configureStore (fixed)
const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modals: modalsReducer,
  },
});

export default store;
