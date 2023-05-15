import { createStore, combineReducers } from 'redux';
import channelsReducer from './slices/channelsSlice'
import usersReducer from './slices/usersSlice'
import messagesReducer from './slices/messagesSlice'
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    channels: channelsReducer,
    users: usersReducer,
    messages: messagesReducer,
});

const store = createStore(rootReducer);

export default store;