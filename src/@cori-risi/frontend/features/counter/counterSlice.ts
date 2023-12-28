import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import AppState, { initialState } from "../../app/AppState";

export const counterSlice: Slice = createSlice({
    initialState: initialState,
    name: "counter",
    reducers: {
        // Read the docs: https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
        increment: (state: AppState) => { (<any>state).value += 1 }, // Immer immutable update
        decrement: (state: AppState) => { (<any>state).value -= 1 }, // <= curly braces required
        incrementByAmount: (state: AppState, action: PayloadAction<number>) => {
            console.log("Add ", action.payload);
            state.value += (typeof action.payload === 'number') ? action.payload : 1;
        },
    }
});

export default counterSlice.reducer;

export const {
    increment,          // type: "counter/increment"
    decrement,          // type: "counter/decrement"
    incrementByAmount   // type: "counter/incrementByAmount"
} = counterSlice.actions;

export const incrementByAmountAsync = (amount: number) => (dispatch: Function, getState: ReturnType<(... args: any) => AppState>) => {
    setTimeout(() => {
        dispatch(incrementByAmount(amount))
    }, 533);
};

export const selectCount = (appState: any) => {
    const state: AppState = appState.counter;  // <= What?!
    console.log("Return state.value", state.value);
    return state.value;
}
