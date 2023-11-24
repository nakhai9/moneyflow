import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface BackdropState {
    isOpen: boolean;
    loadData: boolean;
}

const initialState: BackdropState = {
    isOpen: false,
    loadData: false
}

export const backdropSlice = createSlice({
    name: "backdrop",
    initialState,
    reducers: {
        toggle: (state) => {
            state.isOpen = !state.isOpen;
        },
        setLoadData: (state, action: PayloadAction<boolean>) => {
            state.loadData = action.payload;
        }
    }
})

export const { toggle, setLoadData } = backdropSlice.actions;
export default backdropSlice.reducer;