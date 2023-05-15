import {createSlice} from "@reduxjs/toolkit";

const initialMessagesState = {
    ids: [0],
    entities: [{channelId: 0, id: 0, username: 'Ivan', body: 'test'}],
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialMessagesState,
    reducers: {
        initMessages(state, action) {
            state.entities.length = 0;
            state.entities.push(...action.payload);
        },
        addMessage(state, action) {
            const { message } = action.payload;

            state.entities[message.id] = message;
            state.ids.push(message.id);
        },
        removeMessage(state, action) {
            const { messageId } = action.payload;

            delete state.entities[messageId];
            state.ids = state.ids.filter((id) => id !== messageId);
        },
    },
});

export const { reducer, actions } = messagesSlice;
export default reducer;