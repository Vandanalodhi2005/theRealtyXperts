import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const token = localStorage.getItem('adminToken');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: token ? { username: 'admin', role: 'admin' } : null,
        loading: false,
        error: null,
        isAuthenticated: !!token,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                // Store token in localStorage
                if (action.payload.token) {
                    localStorage.setItem('adminToken', action.payload.token);
                }
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;