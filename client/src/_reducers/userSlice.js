import {createSlice} from '@reduxjs/toolkit';
import { loginUser, registerUser, auth, logoutUser } from '../_actions/user_action';


const userSlice = createSlice({
    name: 'user',
    initialState: {
        loginSuccess: null,
        register: null,
        userData: null,
        loading: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginSuccess = action.payload;
                state.loading = 'idle';
                state.error = null;  // 에러 초기화
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.register = action.payload;
                state.loading = 'idle';
                state.error = null;  // 에러 초기화
            })
            .addCase(auth.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.loading = 'idle';
                state.error = null;  // 에러 초기화
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.userData = null; // 로그아웃 시 사용자 데이터 초기화
                state.loginSuccess = null; // 로그아웃 시 로그인 상태 초기화
                state.loading = 'idle'; // 로딩 상태 초기화
                state.error = null; // 에러 초기화
            })
            .addMatcher(action => action.type.endsWith('/pending'), state => {
                state.loading = 'loading';
            })
            .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => {
                state.loading = 'idle';
                state.error = action.payload;
            });
    }
});

export default userSlice.reducer;