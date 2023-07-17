import { createSlice } from '@reduxjs/toolkit';

const initialUsersState = {
    ids: [],
    entities: {},
};

const usersSlice = createSlice({
    name: 'users',
    initialState: initialUsersState,
    reducers: {
        addUser(state, action) {
            const { user } = action.payload;

            state.entities[user.id] = user;
            state.ids.push(user.id);
        },
        removeUser(state, action) {
            const { userId } = action.payload;

            delete state.entities[userId];
            state.ids = state.ids.filter((id) => id !== userId);
        },
        updateUser(state, action) {
            const { userId, data } = action.payload;

            Object.assign(state.entities[userId], data);
        },
    },
});

export const { reducer, actions } = usersSlice;
export default reducer;
