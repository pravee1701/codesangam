import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice.js";

const store = configureStore({
    reducer: {
        auth: AuthSlice,
    }
});

export default store;