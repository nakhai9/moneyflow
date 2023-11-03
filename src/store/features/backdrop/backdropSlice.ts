import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface BackdropState {
    isOpen: boolean;
}

const initialState: BackdropState = {
    isOpen: false
}

export const backdropSlice = createSlice({
    name: "backdrop",
    initialState,
    reducers: {
        toggle: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
})

export const { toggle } = backdropSlice.actions;
export default backdropSlice.reducer;