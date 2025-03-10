import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;

// Thunk for simulating authentication
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      dispatch(loginSuccess({ 
        id: 1, 
        email: credentials.email, 
        name: 'Demo User' 
      }));
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
}; 