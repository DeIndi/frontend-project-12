import { createSlice } from '@reduxjs/toolkit';

const initialChannelsState = {
    ids: [],
    entities: [
        {id: 1, name: 'General'},
        {id: 2, name: 'Random'},
    ],
    currentChannelId: 1
};
//переименовать в channels
const channelsSlice = createSlice({
    name: 'channels',
    initialState: initialChannelsState,
    reducers: {
        initChannels(state, action) {
            state.entities.length = 0;
            state.entities.push(...action.payload);
        },
        addChannel(state, action) {
            const { channel } = action.payload;

            state.entities[channel.id] = channel;
            state.ids.push(channel.id);
        },
        removeChannel(state, action) {
            const { channelId } = action.payload;

            delete state.entities[channelId];
            state.ids = state.ids.filter((id) => id !== channelId);
        },
        updateChannel(state, action) {
            const { channelId, data } = action.payload;

            Object.assign(state.entities[channelId], data);
        },
        updateCurrentChannelId(state, action) {
            const { channelId } = action.payload;

            Object.assign(state.currentChannelId, channelId);
        }
    },
});

export const { reducer, actions } = channelsSlice;
export default reducer;
