import {createSlice, current} from "@reduxjs/toolkit";

const initialModalsState = {
    currentModal : '',
    currentData : null,
    isVisible : false,
};

const modalsSlice = createSlice({
    name: 'modals',
    initialState: initialModalsState,
    reducers: {
        changeCurrentModal(state, action) {
            const currentModal = action.payload;
            state.currentModal = currentModal;
        }
    },
});

export const { reducer, actions } = modalsSlice;
export default reducer;