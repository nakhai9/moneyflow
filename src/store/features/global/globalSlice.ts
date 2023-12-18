import { IBase, ICommonMessages, ICurrency, IOption } from "@/common/drafts/prisma";
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface GlobalState {
    isOpenSnackbar: boolean;
    snackbarMessages: ICommonMessages | null;

    pageLoading: boolean;

    currencyOptions: IOption[];
    formSubmited: boolean;
}

const initialState: GlobalState = {
    isOpenSnackbar: false,
    snackbarMessages: null,

    pageLoading: true,

    currencyOptions: [],

    formSubmited: false
}

export const globalState = createSlice({
    name: "global",
    initialState,
    reducers: {
        toggleSnackbar: (state, action: PayloadAction<boolean>) => {
            state.isOpenSnackbar = action.payload;
        },
        togglePageLoading: (state, action: PayloadAction<boolean>) => {
            state.pageLoading = action.payload;
        },
        setSnackbarMessages: (state, action: PayloadAction<ICommonMessages>) => {
            state.snackbarMessages = action.payload;
        },
        setCurrencyOptions: (state, action: PayloadAction<(ICurrency & IBase)[]>) => {
            state.currencyOptions = action.payload.map((currency, index) => {
                return {
                    id: currency.id,
                    prop: currency.code,
                    value: currency.id,
                }
            });
        },
        toggleFormSubmited: (state, action: PayloadAction<boolean>) => {
            state.formSubmited = action.payload;
        },
    }
});

export const {
    toggleSnackbar,
    togglePageLoading,
    setSnackbarMessages,
    setCurrencyOptions,
    toggleFormSubmited
} = globalState.actions;
export default globalState.reducer;
