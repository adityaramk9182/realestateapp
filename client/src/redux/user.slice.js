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
        }
    }
})

export const {signInStarts, signInSuccess, signInFailed} = userSlice.actions;

export default userSlice.reducer;