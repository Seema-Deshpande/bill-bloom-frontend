import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getMe } from '../services/authService';
import { AUTH_API } from "../config/apiConfig";

const token = localStorage.getItem("token");
const localUser = localStorage.getItem("user");
const user = localUser ? JSON.parse(localUser) : null;

const initialState = {
    token,
    user,
    loading: false,
    error: null,
    login: {
        status: 'idle',
        error: null
    },
    register: {
        status: 'idle',
        error: null
    }
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await loginUser(credentials.email, credentials.password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await registerUser(userData);
            // Don't auto-login on register, user needs to login
            return { message: data.message || 'Registration successful' };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getMe();
            localStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return rejectWithValue(error.message || 'Failed to fetch user');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        clearError: (state) => {
            state.error = null;
            state.login.error = null;
            state.register.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(login.pending, (state) => {
                state.login.status = 'loading';
                state.login.error = null;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.login.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.login.status = 'failed';
                state.login.error = action.payload;
                state.error = action.payload;
            });

        // Register
        builder
            .addCase(register.pending, (state) => {
                state.register.status = 'loading';
                state.register.error = null;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.register.status = 'succeeded';
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.register.status = 'failed';
                state.register.error = action.payload;
                state.error = action.payload;
            });

        // Fetch Current User
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.token = null;
                state.user = null;
                state.error = action.payload;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;