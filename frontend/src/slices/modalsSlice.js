import {createSlice, current} from "@reduxjs/toolkit";

const initialModalsState = {
    currentModal : '',
    isVisible : false,
    modalData: null,
};
const modalsSlice = createSlice({
    name: 'modals',
    initialState: initialModalsState,
    reducers: {
        /*changeCurrentModal(state, action) {
            const currentModal = action.payload;
            state.currentModal = currentModal;
        },*/
        /*updateModalData(state, action) {
            console.log('action from updateModalData: ', action);
            const { data } = action.payload;
            console.log('data: ', data);
            state.modalData = data;
        },*/
        openModal(state, action) {
            console.log('action payload from openModal: ', action.payload);
            const { modal, data} = action.payload;
            state.modalData = data;
            state.currentModal = modal;
            state.isVisible = true;
        },
        closeModal(state, action) {
            console.log('action payload from closeModal: ', action.payload);
            state.currentModal = '';
            state.isVisible = false;
        },
    },
});

export const { reducer, actions } = modalsSlice;
export default reducer;