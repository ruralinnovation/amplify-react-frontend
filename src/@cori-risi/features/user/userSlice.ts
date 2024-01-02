import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../app/initialState.json";

console.log("Initial state available in userSlice: ", initialState);

export const userSlice = createSlice({
    initialState: initialState.user,
    name: "user",
    reducers: {
        updateUser: (user_state, action) => {
            console.log("Set user:", action.payload);
            if (typeof action.payload.userId === "string"
                && typeof action.payload.username === "string" ) {
                user_state = action.payload;
            }
            return user_state;
        }
    }
});

export default userSlice.reducer;

export const {
    updateUser
} = userSlice.actions;

export const selectUser = (state: (typeof initialState)) => {
    console.log("AppState in selectUser:", state);
    console.log("Return state.user:", state.user);
    return state.user;
}
