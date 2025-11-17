import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budget/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/budgets/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch budgets');
    }
  }
);

export const addBudget = createAsyncThunk(
  'budget/add',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/budgets/', budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/update',
  async ({ id, budgetData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/budgets/${id}/`, budgetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/budgets/${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete budget');
    }
  }
);

const initialState = {
  budgets: [],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add budget
      .addCase(addBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload);
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;


