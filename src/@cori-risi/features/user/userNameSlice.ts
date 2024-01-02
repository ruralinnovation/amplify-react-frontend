import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../app/initialState.json";

console.log("Initial state available in userNameSlice: ", initialState);

export const userNameSlice = createSlice({
    initialState: initialState.user.username,
    name: "username",
    reducers: {
        updateUserName: (user_name, action) => {
            console.log("Set username: ", action.payload);
            if (typeof action.payload == "string") {
                user_name = action.payload;
            }
            return user_name;
        }
    }
});

export default userNameSlice.reducer;

export const {
    updateUserName
} = userNameSlice.actions;

export const selectUserName = (state: (typeof initialState)) => {
    console.log("AppState in selectUser:", state);
    console.log("Return state.user.username:", state.user.username);
    return state.user.username;
}

export const selectUser = (state: (typeof initialState)) => {
    console.log("AppState in selectUser:", state);
    console.log("Return state.user:", state.user);
    return state.user;
}
