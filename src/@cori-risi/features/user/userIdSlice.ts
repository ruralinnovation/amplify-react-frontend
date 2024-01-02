import { createSlice } from "@reduxjs/toolkit";
import initialState from "../../app/initialState.json";

console.log("Initial state available in userIdSlice: ", initialState);

export const userIdSlice = createSlice({
    initialState: initialState.user.userId,
    name: "userId",
    reducers: {
        updateUserId: (user_id, action) => {
            console.log("Set userId: ", action.payload);
            if (typeof action.payload == "string") {
                user_id = action.payload;
            }
            return user_id;
        }
    }
});

export default userIdSlice.reducer;

export const {
    updateUserId
} = userIdSlice.actions;

export const selectUserId = (state: (typeof initialState)) => {
    console.log("AppState in selectUser:", state);
    console.log("Return state.user.userId:", state.user.userId);
    return state.user.userId;
}

export const selectUser = (state: (typeof initialState)) => {
    console.log("AppState in selectUser:", state);
    console.log("Return state.user:", state.user);
    return state.user;
}
