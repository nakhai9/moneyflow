import { IBase } from '@/common/interfaces/base';
import { IUser, IUserInfo } from '@/common/interfaces/user';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
    isLoading: boolean;
    userInfo: IUserInfo | null;
    accessToken: string;
    error: any;
    user: (IUser & IBase) | null;
}

const initialState: AuthState = {
    isLoading: false,
    user: null,
    userInfo: null,
    error: null,
    accessToken: '',
}

export const authState = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
            state.userInfo = action.payload
        },
        setError: (state, action: PayloadAction<IUserInfo>) => {
            state.error = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        clearUserAndToken: (state) => {
            state.userInfo = null;
            state.accessToken = '';
        },
        setCurrentUser: (state, action: PayloadAction<(IUser & IBase) | null>) => {
            state.user = action.payload;
        }
    },
});

export const { setUserInfo, setAccessToken, clearUserAndToken, setCurrentUser } = authState.actions;
export default authState.reducer;