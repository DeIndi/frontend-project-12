import { createSlice } from "@reduxjs/toolkit";

const initialMessagesState = {
    ids: [],
    entities: [],
};
// TODO: обработка из соседнего слайса (messages должен обрабатывать channels)
const messagesSlice = createSlice({
    name: 'messages',
    initialState: initialMessagesState,
    reducers: {
        initMessages(state, action) {
            state.entities.length = 0;
            state.entities.push(...action.payload);
        },
        addMessage(state, action) {
            const { id, body, channelId, username } = action.payload;
            state.entities[id] = { id, body, channelId, username };
        },
        removeChannelMessages(state, action) {
            const channelId = action.payload;
            state.entities = state.entities.filter((message) => message.channelId !== channelId);
            },
    },
});

export const { reducer, actions } = messagesSlice;
export default reducer;