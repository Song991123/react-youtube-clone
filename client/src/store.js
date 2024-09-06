import {configureStore} from '@reduxjs/toolkit';
import userReducer from './_reducers/userSlice';

const store = configureStore({
    reducer: {
        user: userReducer
    }
});

export default store;