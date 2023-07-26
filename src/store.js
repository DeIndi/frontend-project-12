import { createStore, combineReducers } from 'redux';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';
import modalsReducer from './slices/modalsSlice';

// TODO: здесь стоит использовать redux-toolkit
const rootReducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  modals: modalsReducer,
});
// TODO: вернуть configureStore
const store = createStore(rootReducer);

export default store;
