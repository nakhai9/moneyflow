import { createSlice } from "@reduxjs/toolkit"

export interface GlobalState {

}

const initialState: GlobalState = {

}

export const globalState = createSlice({
    name: "global",
    initialState,
    reducers: {}
});

export const {} = globalState.actions;
export default globalState.reducer;
