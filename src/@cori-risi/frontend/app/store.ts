import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../../features";
import { collectionReducer, counterReducer } from "../features";
import AppState from "./AppState";

const store =  configureStore({
    reducer: {
        user: userReducer,
        collection: collectionReducer,
        counter: counterReducer
    }
});

export default store;
export type { AppState };
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
