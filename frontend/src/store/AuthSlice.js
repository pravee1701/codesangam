import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn : false,
    isLogInCheckDone: false,
    userData: null,
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.isLoggedIn = true,
            state.userData = action.payload
        },
        updateLogInCheckDone: (state, action) => {
            state.isLogInCheckDone = true
        },
        logoutUser: (state, action) => {
            return {...initialState, isLogInCheckDone: true};
        }
    }
})

export const { loginUser, updateLogInCheckDone, logoutUser} = AuthSlice.actions;

export default AuthSlice.reducer;