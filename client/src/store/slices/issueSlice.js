import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as issueApi from '../../api/issueApi';

export const fetchIssues = createAsyncThunk(
  'issues/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await issueApi.getIssues(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch issues');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'issues/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await issueApi.getIssueStats();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const addIssue = createAsyncThunk(
  'issues/add',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await issueApi.createIssue(payload);
      dispatch(fetchStats());
      return res.issue;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create issue');
    }
  }
);

export const patchIssue = createAsyncThunk(
  'issues/patch',
  async ({ id, payload }, { dispatch, rejectWithValue }) => {
    try {
      const res = await issueApi.updateIssue(id, payload);
      dispatch(fetchStats());
      return res.issue;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update issue');
    }
  }
);

export const patchStatus = createAsyncThunk(
  'issues/patchStatus',
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const res = await issueApi.updateIssueStatus(id, status);
      dispatch(fetchStats());
      return res.issue;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

export const removeIssue = createAsyncThunk(
  'issues/remove',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await issueApi.deleteIssue(id);
      dispatch(fetchStats());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete issue');
    }
  }
);

const issueSlice = createSlice({
  name: 'issues',
  initialState: {
    items: [],
    summary: { Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0 },
    pagination: null,
    loading: false,
    submitting: false,
    error: null,
    filters: { search: '', status: '', priority: '', severity: '', page: 1, limit: 8 },
    viewMode: 'grid',
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { search: '', status: '', priority: '', severity: '', page: 1, limit: state.filters.limit };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.issues;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchIssues.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchStats.fulfilled, (state, action) => { state.summary = action.payload.summary; })
      
      .addMatcher(
        (action) => [addIssue.pending, patchIssue.pending, patchStatus.pending, removeIssue.pending].includes(action.type),
        (state) => { state.submitting = true; state.error = null; }
      )
      .addMatcher(
        (action) => [addIssue.fulfilled, patchIssue.fulfilled, patchStatus.fulfilled, removeIssue.fulfilled].includes(action.type),
        (state) => { state.submitting = false; }
      )
      .addMatcher(
        (action) => [addIssue.rejected, patchIssue.rejected, patchStatus.rejected, removeIssue.rejected].includes(action.type),
        (state, action) => { state.submitting = false; state.error = action.payload; });
  },
});

export const { setFilters, resetFilters, setViewMode, clearError } = issueSlice.actions;
export default issueSlice.reducer;
