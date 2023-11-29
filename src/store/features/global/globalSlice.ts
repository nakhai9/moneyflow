import { ICommonMessages } from "@/common/drafts/prisma";
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface GlobalState {
    isOpenSnackbar: boolean;
    snackbarMessages: ICommonMessages | null;

    isOpenBackdrop: boolean;
}

const initialState: GlobalState = {
    isOpenSnackbar: false,
    snackbarMessages: null,

    isOpenBackdrop: false
}

export const globalState = createSlice({
    name: "global",
    initialState,
    reducers: {
        toggleSnackbar: (state, action: PayloadAction<boolean>) => {
            state.isOpenSnackbar = action.payload;
        },
        toggleBackdrop: (state, action: PayloadAction<boolean>) => {
            state.isOpenBackdrop = action.payload;
        },
        setSnackbarMessages: (state, action: PayloadAction<ICommonMessages>) => {
            state.snackbarMessages = action.payload;
        }
    }
});

export const {
    toggleSnackbar,
    toggleBackdrop,
    setSnackbarMessages
} = globalState.actions;
export default globalState.reducer;
