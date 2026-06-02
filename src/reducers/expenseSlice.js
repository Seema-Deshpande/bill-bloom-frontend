import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as expenseService from "../services/expenseService.js";

// Async Thunks
export const createExpense = createAsyncThunk(
    'expense/createExpense',
    async (expenseData, { rejectWithValue }) => {
        try {
            const data = await expenseService.createExpense(expenseData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to create expense");
        }
    }
);

export const fetchPersonalExpenses = createAsyncThunk(
    'expense/fetchPersonal',
    async (_, { rejectWithValue }) => {
        try {
            const data = await expenseService.getPersonalExpenses();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch personal expenses");
        }
    }
);

export const fetchGroupExpenses = createAsyncThunk(
    'expense/fetchGroup',
    async (groupId, { rejectWithValue }) => {
        try {
            const data = await expenseService.getGroupExpenses(groupId);
            return { groupId, data };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch group expenses");
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expense/deleteExpense',
    async (expenseId, { rejectWithValue }) => {
        try {
            const data = await expenseService.deleteExpense(expenseId);
            return { expenseId, data };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to delete expense");
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
        data: {},
        loading: false,
        error: null,
    },
    create: {
        loading: false,
        error: null,
        success: false,
    },
    delete: {
        loading: false,
        error: null,
        success: false,
    },
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        clearExpenseError: (state) => {
            state.personal.error = null;
            state.group.error = null;
            state.create.error = null;
            state.delete.error = null;
        },
        clearPersonalExpenses: (state) => {
            state.personal.data = [];
        },
        clearGroupExpenses: (state) => {
            state.group.data = {};
        },
        resetCreateStatus: (state) => {
            state.create.loading = false;
            state.create.error = null;
            state.create.success = false;
        },
        resetDeleteStatus: (state) => {
            state.delete.loading = false;
            state.delete.error = null;
            state.delete.success = false;
        },
    },
    extraReducers: (builder) => {
        // Create Expense
        builder
            .addCase(createExpense.pending, (state) => {
                state.create.loading = true;
                state.create.error = null;
                state.create.success = false;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.create.loading = false;
                state.create.success = true;
                // Add to appropriate list based on type
                if (action.payload.type === 'personal') {
                    state.personal.data.push(action.payload);
                }
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = action.payload;
                state.create.success = false;
            });

        // Fetch Personal Expenses
        builder
            .addCase(fetchPersonalExpenses.pending, (state) => {
                state.personal.loading = true;
                state.personal.error = null;
            })
            .addCase(fetchPersonalExpenses.fulfilled, (state, action) => {
                state.personal.loading = false;
                state.personal.data = action.payload || [];
            })
            .addCase(fetchPersonalExpenses.rejected, (state, action) => {
                state.personal.loading = false;
                state.personal.error = action.payload;
            });

        // Fetch Group Expenses
        builder
            .addCase(fetchGroupExpenses.pending, (state) => {
                state.group.loading = true;
                state.group.error = null;
            })
            .addCase(fetchGroupExpenses.fulfilled, (state, action) => {
                state.group.loading = false;
                state.group.data[action.payload.groupId] = action.payload.data;
            })
            .addCase(fetchGroupExpenses.rejected, (state, action) => {
                state.group.loading = false;
                state.group.error = action.payload;
            });

        // Delete Expense
        builder
            .addCase(deleteExpense.pending, (state) => {
                state.delete.loading = true;
                state.delete.error = null;
                state.delete.success = false;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.delete.loading = false;
                state.delete.success = true;
                // Remove from personal expenses
                state.personal.data = state.personal.data.filter(
                    (expense) => expense._id !== action.payload.expenseId
                );
                // Remove from all group expenses
                Object.keys(state.group.data).forEach((groupId) => {
                    state.group.data[groupId] = state.group.data[groupId].filter(
                        (expense) => expense._id !== action.payload.expenseId
                    );
                });
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.delete.loading = false;
                state.delete.error = action.payload;
                state.delete.success = false;
            });
    },
});

export const {
    clearExpenseError,
    clearPersonalExpenses,
    clearGroupExpenses,
    resetCreateStatus,
    resetDeleteStatus,
} = expenseSlice.actions;

export default expenseSlice.reducer;