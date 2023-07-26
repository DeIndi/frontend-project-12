/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalTypes = {
  add: 'add',
  rename: 'rename',
  remove: 'remove',
};

const initialModalsState = {
  type: null,
  isVisible: false,
  data: null,
};
// TODO: modalData переименовать в data (fixed)
const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialModalsState,
  reducers: {
    // TODO: давай вынесем отдельно тип откдываемой модалки (fixed)
    openModal(state, action) {
      console.log('action payload from openModal: ', action.payload);
      const { modal, data } = action.payload;
      state.data = data ?? '';
      state.type = modalTypes[modal];
      state.isVisible = true;
    },
    closeModal(state, action) {
      console.log('action payload from closeModal: ', action.payload);
      state.type = null;
      state.isVisible = false;
    },
  },
});

export const { reducer, actions } = modalsSlice;
export default reducer;
