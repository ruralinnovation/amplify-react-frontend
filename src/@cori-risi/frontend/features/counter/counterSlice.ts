import {createSlice, PayloadAction, Slice} from '@reduxjs/toolkit';
import initialState from "../../app/initialState.json";

export type AppState = typeof initialState; // ... can (should?) alternatively define AppState in it's own type file

export const counterSlice: Slice = createSlice({
    initialState,
    name: "counter",
    reducers: {
        // Read the docs: https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
        increment: (state: AppState, action: PayloadAction<number>) => { state.value += 1 }, // Immer immutable update
        decrement: (state: AppState, action: PayloadAction<number>) => { state.value -= 1 }, // <= curly braces required
        incrementByAmount: (state: AppState, action: PayloadAction<number>) => {
            console.log("Add ", action.payload);
            state.value += (typeof action.payload === 'number') ? action.payload : 1;
        },
    }
});

export const {
    increment,          // type: "counter/increment"
    decrement,          // type: "counter/decrement"
    incrementByAmount   // type: "counter/incrementByAmount"
} = counterSlice.actions;

export default counterSlice.reducer;

export const incrementByAmountAsync = (amount: number) => (dispatch: Function, getState: ReturnType<(... args: any) => AppState>) => {
    setTimeout(() => {
        dispatch(incrementByAmount(amount))
    }, 533);
}
