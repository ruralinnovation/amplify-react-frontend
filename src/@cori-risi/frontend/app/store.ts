import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../../features";
import { counterReducer } from "../features";
import AppState from "./AppState";
import {collectionReducer} from "../features/index";

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
