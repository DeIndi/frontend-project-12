import { createSlice } from '@reduxjs/toolkit';

const initialModalsState = {
  currentModal: '',
  isVisible: false,
  modalData: null,
};
const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialModalsState,
  reducers: {
    openModal(state, action) {
      console.log('action payload from openModal: ', action.payload);
      const { modal, data } = action.payload;
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
