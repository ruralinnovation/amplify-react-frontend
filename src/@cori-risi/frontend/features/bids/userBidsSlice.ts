import { createSlice } from '@reduxjs/toolkit';
import { initialState } from "../../app/AppState";

console.log("Initial state available in userBidsSlice: ", initialState);

const initialStateWithUserBids = {
    ...initialState,
    user: {
        ...initialState.user,
        "bids": {
            "all": [],
            "current": null
        }
    }
}

export const userBidsSlice = createSlice({
    initialState: initialStateWithUserBids.user.bids,
    name: "bids",
    reducers: {
        addUserBid: (user_bids, action) => {
            console.log("Add user bid:", action.payload);
            user_bids.current = action.payload;
            if (user_bids.current !== null) {
                user_bids.all.unshift(user_bids.current);
            }
            return user_bids;
        },
        updateAllUserBids: (user_bids, action) => {
            console.log("Set user bids:", action.payload);
            user_bids.all = action.payload;
            user_bids.current = user_bids.all[0];
            return user_bids;
        }
    }
});

export default userBidsSlice.reducer;

export const {
    addUserBid,
    updateAllUserBids
} = userBidsSlice.actions;

export const selectUserBids = (state: (typeof initialStateWithUserBids)) => {
    console.log("AppState in selectUserBids:", state);
    console.log("Return state.user.bids:", state.user.bids);
    return state.user.bids;
}
