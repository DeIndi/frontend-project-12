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

const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialModalsState,
  reducers: {
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
