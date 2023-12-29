import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

// console.log("Full state available in counterSlice: ", initialState);

export const counterSlice = createSlice({ //! DO NOT ADD EXPLICIT TYPES FOR createSlice definition
    initialState: initialState.counter, // <- Only provide relevant *part* of state
    name: "counter",
    reducers: {
        // Read the docs: https://redux.js.org/usage/structuring-reducers/immutable-update-patterns
        increment: (counter_state) => { counter_state.value += 1 }, // Immer immutable update
        decrement: (counter_state) => { counter_state.value -= 1 }, // <= curly braces required
        incrementByAmount: (counter_state, action) => {
            console.log("Add ", action.payload);
            counter_state.value += (typeof action.payload === 'number') ? action.payload : 1;
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

export const selectCount = (state: (typeof initialState)) => {
    console.log("AppState in selectCount:", state);
    console.log("Return state.counter.value:", state.counter.value);
    return state.counter.value;
}
