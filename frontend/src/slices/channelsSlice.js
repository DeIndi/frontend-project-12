import {createSlice, current} from '@reduxjs/toolkit';

const initialChannelsState = {
    ids: [], entities: [], currentChannelId: 0, channelToRename: {id: null, name: null},
};
// TODO: Перенести данные по переименованию/удалению в слайс модальных окон
const channelsSlice = createSlice({
    name: 'channels', initialState: initialChannelsState, reducers: {
        initChannels(state, action) {
            state.entities.length = 0;
            state.entities.push(...action.payload);
        }, updateCurrentChannelId(state, action) {
            state.currentChannelId = action.payload;
        }, addChannel(state, action) {
            const {id, name} = action.payload;
            state.entities.push({id, name, removable: true});
            state.ids.push(id);
        }, removeChannel(state, action) {
            const channelId = action.payload;
            state.entities = state.entities.filter((channel) => channel.id !== channelId);
            state.ids = state.ids.filter((id) => id !== channelId);
        }, renameChannel(state, action) {
            const {id, name} = action.payload;
            console.log('channel to rename (from actions):', id, name);
            console.log('current state: ', current(state));
            // TODO: Мгновенное переименование канала (сравнение некорректно)
            const channelToRename = state.entities.find((channel) => {
                console.log('Comparing channel with id:', channel.id);
                console.log('to id:', id);
                return channel.id === id;
            });
            if (channelToRename) {
                console.dir('channel to rename:', channelToRename);
                channelToRename.name = name;
            } else {
                console.log('Channel not found.');
            }
        }, updateChannel(state, action) {
            const {channelId, data} = action.payload;
            Object.assign(state.entities[channelId], data);
        }, updateChannelToRename(state, action) {
            const {id, name} = action.payload;
            state.channelToRename = {id, name};
        },
    },
});

export const {reducer, actions} = channelsSlice;
export default reducer;
