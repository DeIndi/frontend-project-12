import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';
import modalsReducer from './slices/modalsSlice';

// TODO: здесь стоит использовать redux-toolkit
const rootReducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modals: modalsReducer,
});
// TODO: вернуть configureStore (fixed)
const store = configureStore(
  { reducer: rootReducer },
);

export default store;
