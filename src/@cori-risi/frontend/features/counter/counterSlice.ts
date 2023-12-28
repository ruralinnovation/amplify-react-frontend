import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

export const counterSlice = createSlice({ //! DO NOT ADD EXPLICIT TYPES FOR createSlice definition
    initialState: initialState,
    name: "counter",
    reducers: {
        // Read the docs: https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
        increment: (state) => { state.value += 1 }, // Immer immutable update
        decrement: (state) => { state.value -= 1 }, // <= curly braces required
        incrementByAmount: (state, action) => {
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

export const incrementByAmountAsync = (amount: number) => (dispatch: Function, /* getState: ReturnType<(... args: any) => AppState>*/) => {
    setTimeout(() => {
        dispatch(incrementByAmount(amount))
    }, 533);
};

export const selectCount = (appState: any) => {
    const state = appState.counter;  // <= What?!
    console.log("Return state.value", state.value);
    return state.value;
}
