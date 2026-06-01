import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../reducers/authSlice.js'
import groupReducer from '../reducers/groupSlice.js';
import expenseReducer from '../reducers/expenseSlice.js'
import settlementReducer from '../reducers/settlementSlice.js';
import analyticsReducer from '../reducers/analyticsSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        group: groupReducer,
        expense: expenseReducer,
        settlement: settlementReducer,
        analytics: analyticsReducer
    }
})