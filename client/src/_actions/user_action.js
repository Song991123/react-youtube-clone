import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_SERVER } from './../Config';

// Async thunk actions
export const loginUser = createAsyncThunk(
    'user/login',
    async (dataToSubmit, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/users/login', dataToSubmit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (dataToSubmit, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/users/register', dataToSubmit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const auth = createAsyncThunk(
    'user/auth',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get('/api/users/auth');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${USER_SERVER}/logout`);
            return response.data; // 성공 시 반환되는 payload
        } catch (error) {
            return rejectWithValue(error.response.data); // 실패 시 반환되는 에러
        }
    }
)