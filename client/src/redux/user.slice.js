import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    loading:false,
    response:''
}

const userSlice = createSlice({
    name:'User',
    initialState,
    reducers:{
        signInStarts(state){
            state.loading = true;
        },
        signInSuccess(state, action){
            state.loading = false,
            state.response = action.payload.message,
            state.currentUser = action.payload.user
        },
        signInFailed(state, action){
            state.loading = false,
            state.response = action.payload.message
        },
        profileUpdateStarts(state){
            state.loading = true
        },
        profileUpdateSuccess(state, action){
            state.loading = false
            state.currentUser = action.payload.user,
            state.response = action.payload.message
        },
        profileUpdateFailed(state, action){
            state.loading = false,
            state.response = action.payload.message
        },
        deleteUserStarts(state){
            state.loading = true
        },
        deleteUserSuccess(state, action){
            state.loading = false,
            state.currentUser = null,
            state.response = action.payload
        },
        deleteUserFailed(state, action){
            state.loading = false,
            state.response = action.payload
        },
        signoutUserStarts(state){
            state.loading = true
        },
        signoutUserSuccess(state, action){
            state.loading = false,
            state.currentUser = null,
            state.response = action.payload
        },
        signoutUserFailed(state, action){
            state.loading = false,
            state.response = action.payload
        }
    }
})

export const {signInStarts, signInSuccess, signInFailed, profileUpdateStarts,
profileUpdateSuccess, profileUpdateFailed, deleteUserStarts, deleteUserSuccess, deleteUserFailed,
signoutUserStarts, signoutUserSuccess, signoutUserFailed} = userSlice.actions;

export default userSlice.reducer;