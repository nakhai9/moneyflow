import { IBase, IWallet } from '@/common/drafts/prisma';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface WalletState {
    wallets: (IWallet & IBase)[] | null;
}

const initialState: WalletState = {
    wallets: []
}

export const walletState = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setWallets: (state, action: PayloadAction<(IBase & IWallet)[]>) => {
            state.wallets = action.payload;
        }
    },
});

export const { setWallets } = walletState.actions;
export default walletState.reducer;