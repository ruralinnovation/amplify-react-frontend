import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Full state available in collectionSlice: ", initialState);

export const collectionSlice = createSlice({
    initialState: initialState.collection,
    name: "counter",
    reducers: {}
});

export default collectionSlice.reducer;

export const selectCollection = (state: (typeof initialState)) => {
    console.log("AppState in selectCollection:", state);
    console.log("Return state.counter.value:", state.collection.all);
    return state.collection.all;
}
