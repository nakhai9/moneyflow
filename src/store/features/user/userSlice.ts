import { IBase, IUser } from '@/common/drafts/prisma';
import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
    user: (IUser & IBase) | null;
    accessToken: string;
}

const initialState: UserState = {
    user: null,
    accessToken: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearUserAndToken: (state) => {
            state.user = null,
            state.accessToken = ''
        }
    },
});

export const { setUser, setAccessToken, clearUserAndToken } = userSlice.actions;
export default userSlice.reducer;