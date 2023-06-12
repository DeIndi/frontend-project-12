import {createSlice, current} from "@reduxjs/toolkit";

const initialModalsState = {
    currentModal : '',
    currentData : null,
    isVisible : false,
    targetChannel: {id: null, name: null}
};

const modalsSlice = createSlice({
    name: 'modals',
    initialState: initialModalsState,
    reducers: {
        changeCurrentModal(state, action) {
            const currentModal = action.payload;
            state.currentModal = currentModal;
        },
        updateTargetChannel(state, action) {
            const {id, name} = action.payload;
            state.targetChannel = {id, name};
        },
    },
});

export const { reducer, actions } = modalsSlice;
export default reducer;