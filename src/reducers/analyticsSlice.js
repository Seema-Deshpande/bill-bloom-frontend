import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as analyticsService from "../services/analyticsService";

// Async Thunks
export const fetchPersonalAnalytics = createAsyncThunk(
  "analytics/fetchPersonal",
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getMonthlyPersonal();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch personal analytics");
    }
  }
);

export const fetchGroupAnalytics = createAsyncThunk(
  "analytics/fetchGroupSpending",
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getGroupSpending();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch group analytics");
    }
  }
);

export const fetchGroupCategoryAnalytics = createAsyncThunk(
  "analytics/fetchGroupCategories",
  async (groupId, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getGroupCategories(groupId);
      return { groupId, data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch group category analytics");
    }
  }
);

export const fetchPersonalCategoryAnalytics = createAsyncThunk(
  "analytics/fetchPersonalCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await analyticsService.getPersonalCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch personal category analytics");
    }
  }
);

const initialState = {
  personal: {
    data: [],
    loading: false,
    error: null,
  },
  group: {
    data: [],
    loading: false,
    error: null,
  },
  groupCategories: {
    data: {},
    loading: false,
    error: null,
  },
  personalCategories: {
    data: [],
    loading: false,
    error: null,
  },
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.personal.error = null;
      state.group.error = null;
      state.groupCategories.error = null;
      state.personalCategories.error = null;
    },
    clearPersonalData: (state) => {
      state.personal.data = [];
    },
    clearGroupData: (state) => {
      state.group.data = [];
    },
    clearGroupCategoriesData: (state) => {
      state.groupCategories.data = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch Personal Analytics
    builder
      .addCase(fetchPersonalAnalytics.pending, (state) => {
        state.personal.loading = true;
        state.personal.error = null;
      })
      .addCase(fetchPersonalAnalytics.fulfilled, (state, action) => {
        state.personal.loading = false;
        state.personal.data = action.payload || [];
      })
      .addCase(fetchPersonalAnalytics.rejected, (state, action) => {
        state.personal.loading = false;
        state.personal.error = action.payload;
      });

    // Fetch Group Analytics
    builder
      .addCase(fetchGroupAnalytics.pending, (state) => {
        state.group.loading = true;
        state.group.error = null;
      })
      .addCase(fetchGroupAnalytics.fulfilled, (state, action) => {
        state.group.loading = false;
        state.group.data = action.payload || [];
      })
      .addCase(fetchGroupAnalytics.rejected, (state, action) => {
        state.group.loading = false;
        state.group.error = action.payload;
      });

    // Fetch Group Category Analytics
    builder
      .addCase(fetchGroupCategoryAnalytics.pending, (state) => {
        state.groupCategories.loading = true;
        state.groupCategories.error = null;
      })
      .addCase(fetchGroupCategoryAnalytics.fulfilled, (state, action) => {
        state.groupCategories.loading = false;
        state.groupCategories.data[action.payload.groupId] = action.payload.data;
      })
      .addCase(fetchGroupCategoryAnalytics.rejected, (state, action) => {
        state.groupCategories.loading = false;
        state.groupCategories.error = action.payload;
      });

    // Fetch Personal Category Analytics
    builder
      .addCase(fetchPersonalCategoryAnalytics.pending, (state) => {
        state.personalCategories.loading = true;
        state.personalCategories.error = null;
      })
      .addCase(fetchPersonalCategoryAnalytics.fulfilled, (state, action) => {
        state.personalCategories.loading = false;
        state.personalCategories.data = action.payload || [];
      })
      .addCase(fetchPersonalCategoryAnalytics.rejected, (state, action) => {
        state.personalCategories.loading = false;
        state.personalCategories.error = action.payload;
      });
  },
});

export const {
  clearAnalyticsError,
  clearPersonalData,
  clearGroupData,
  clearGroupCategoriesData,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;