import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {
    userIdReducer,
    userNameReducer
} from "../../features";
import {
    userBidsReducer,
    collectionReducer,
    counterReducer
} from "../features";
import AppState from "./AppState";

const store =  configureStore({
    reducer: {
        user: combineReducers({
            userId: userIdReducer,
            username: userNameReducer,
            bids: userBidsReducer
        }),
        // user: userBidsReducer,
        collection: collectionReducer,
        counter: counterReducer
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
