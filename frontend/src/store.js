import { createStore, combineReducers } from 'redux';
import channelsReducer from './slices/channelsSlice'
import usersReducer from './slices/usersSlice'
import messagesReducer from './slices/messagesSlice'
import modalsReducer from './slices/modalsSlice'

const rootReducer = combineReducers({
    channels: channelsReducer,
    users: usersReducer,
    messages: messagesReducer,
    modals: modalsReducer,
});

const store = createStore(rootReducer);

export default store;