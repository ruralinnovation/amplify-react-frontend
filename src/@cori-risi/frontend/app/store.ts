import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "../features";

export default configureStore({
    reducer: {
        counterReducer
    }
});
