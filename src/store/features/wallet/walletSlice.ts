import { IAccount } from '@/common/interfaces/account';
import { IBase } from '@/common/interfaces/base';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface WalletState {
    wallets: (IAccount& IBase)[] | null;
}

const initialState: WalletState = {
    wallets: []
}

export const walletState = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setWallets: (state, action: PayloadAction<(IBase & IAccount)[]>) => {
            state.wallets = action.payload;
        }
    },
});

export const { setWallets } = walletState.actions;
export default walletState.reducer;