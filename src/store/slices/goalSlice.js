import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunks to talk to the Django backend (/api/goals/)
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const res = await axiosInstance.get('goals/');
  return res.data;
});

export const addGoal = createAsyncThunk('goals/addGoal', async (goalData) => {
  const res = await axiosInstance.post('goals/', goalData);
  return res.data;
});

export const updateGoal = createAsyncThunk('goals/updateGoal', async ({ id, goalData }) => {
  const res = await axiosInstance.put(`goals/${id}/`, goalData);
  return res.data;
});

export const deleteGoal = createAsyncThunk('goals/deleteGoal', async (id) => {
  await axiosInstance.delete(`goals/${id}/`);
  return id;
});

// Contribution thunks
export const addContribution = createAsyncThunk('goals/addContribution', async ({ goalId, amount, date, note }) => {
  const res = await axiosInstance.post('contributions/', {
    goal: goalId,
    amount: amount,
    date: date || new Date().toISOString().split('T')[0],
    note: note || ''
  });
  return res.data;
});

export const fetchContributions = createAsyncThunk('goals/fetchContributions', async (goalId) => {
  const res = await axiosInstance.get(`contributions/?${goalId}`);
  return res.data;
});

// Strategy Item thunks
export const addStrategyItem = createAsyncThunk('goals/addStrategyItem', async ({ goalId, method, monthlyContribution, order }) => {
  const res = await axiosInstance.post('strategy/', {
    goal: goalId,
    method: method,
    monthly_contribution: monthlyContribution,
    order: order || 0
  });
  return res.data;
});

export const updateStrategyItem = createAsyncThunk('goals/updateStrategyItem', async ({ id, method, monthlyContribution, order }) => {
  const res = await axiosInstance.put(`strategy/${id}/`, {
    method: method,
    monthly_contribution: monthlyContribution,
    order: order || 0
  });
  return res.data;
});

export const deleteStrategyItem = createAsyncThunk('goals/deleteStrategyItem', async (id) => {
  await axiosInstance.delete(`strategy/ ${id}/`);
  return id;
});

const initialState = {
  goals: [],
  loading: false,
  error: null,
  contributions: [],
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.unshift(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.goals.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.goals[idx] = action.payload;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
      })
      .addCase(addContribution.fulfilled, (state, action) => {
        // After adding contribution, refetch goals to get updated total_saved
        // This will be handled by refreshing the goals list
      })
      .addCase(fetchContributions.fulfilled, (state, action) => {
        state.contributions = action.payload;
      })
      .addCase(addStrategyItem.fulfilled, (state, action) => {
        // Strategy item added, refresh goals to get updated strategy_items
      })
      .addCase(updateStrategyItem.fulfilled, (state, action) => {
        // Strategy item updated, refresh goals to get updated strategy_items
      })
      .addCase(deleteStrategyItem.fulfilled, (state, action) => {
        // Strategy item deleted, refresh goals to get updated strategy_items
      });
  },
});

export default goalSlice.reducer;
 
