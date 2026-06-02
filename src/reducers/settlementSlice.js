import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as settlementService from "../services/settlementService";

// Async Thunks
export const calculateSettlements = createAsyncThunk(
    'settlement/calculate',
    async (groupId, { rejectWithValue }) => {
        try {
            const data = await settlementService.getCalculatedSettlements(groupId);
            return { groupId, data };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to calculate settlements");
        }
    }
);

export const fetchGroupSettlementHistory = createAsyncThunk(
    'settlement/fetchHistory',
    async (groupId, { rejectWithValue }) => {
        try {
            const data = await settlementService.getGroupSettlements(groupId);
            return { groupId, data };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch settlement history");
        }
    }
);

export const recordSettlement = createAsyncThunk(
    'settlement/record',
    async (settlementData, { rejectWithValue }) => {
        try {
            const data = await settlementService.recordSettlement(settlementData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to record settlement");
        }
    }
);

const initialState = {
    calculated: {
        data: {},
        loading: false,
        error: null,
    },
    history: {
        data: {},
        loading: false,
        error: null,
    },
    record: {
        loading: false,
        error: null,
        success: false,
    },
};

const settlementSlice = createSlice({
    name: 'settlement',
    initialState,
    reducers: {
        clearSettlementError: (state) => {
            state.calculated.error = null;
            state.history.error = null;
            state.record.error = null;
        },
        clearCalculatedSettlements: (state) => {
            state.calculated.data = {};
        },
        clearSettlementHistory: (state) => {
            state.history.data = {};
        },
        resetRecordStatus: (state) => {
            state.record.loading = false;
            state.record.error = null;
            state.record.success = false;
        },
    },
    extraReducers: (builder) => {
        // Calculate Settlements
        builder
            .addCase(calculateSettlements.pending, (state) => {
                state.calculated.loading = true;
                state.calculated.error = null;
            })
            .addCase(calculateSettlements.fulfilled, (state, action) => {
                state.calculated.loading = false;
                state.calculated.data[action.payload.groupId] = action.payload.data;
            })
            .addCase(calculateSettlements.rejected, (state, action) => {
                state.calculated.loading = false;
                state.calculated.error = action.payload;
            });

        // Fetch Settlement History
        builder
            .addCase(fetchGroupSettlementHistory.pending, (state) => {
                state.history.loading = true;
                state.history.error = null;
            })
            .addCase(fetchGroupSettlementHistory.fulfilled, (state, action) => {
                state.history.loading = false;
                state.history.data[action.payload.groupId] = action.payload.data;
            })
            .addCase(fetchGroupSettlementHistory.rejected, (state, action) => {
                state.history.loading = false;
                state.history.error = action.payload;
            });

        // Record Settlement
        builder
            .addCase(recordSettlement.pending, (state) => {
                state.record.loading = true;
                state.record.error = null;
                state.record.success = false;
            })
            .addCase(recordSettlement.fulfilled, (state, action) => {
                state.record.loading = false;
                state.record.success = true;
                
                // Add settlement to history
                const groupId = action.payload.groupId;
                if (state.history.data[groupId]) {
                    state.history.data[groupId].push(action.payload);
                } else {
                    state.history.data[groupId] = [action.payload];
                }
            })
            .addCase(recordSettlement.rejected, (state, action) => {
                state.record.loading = false;
                state.record.error = action.payload;
                state.record.success = false;
            });
    },
});

export const {
    clearSettlementError,
    clearCalculatedSettlements,
    clearSettlementHistory,
    resetRecordStatus,
} = settlementSlice.actions;

export default settlementSlice.reducer;