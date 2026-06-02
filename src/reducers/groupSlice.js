import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as groupService from "../services/groupService";

// Async Thunks
export const fetchAllGroups = createAsyncThunk(
    'group/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await groupService.getGroups();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch groups");
        }
    }
);

export const fetchGroupById = createAsyncThunk(
    'group/fetchById',
    async (groupId, { rejectWithValue }) => {
        try {
            const data = await groupService.getGroupById(groupId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch group details");
        }
    }
);

export const createGroup = createAsyncThunk(
    'group/create',
    async (groupData, { rejectWithValue }) => {
        try {
            const data = await groupService.createGroup(groupData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to create group");
        }
    }
);

export const updateGroup = createAsyncThunk(
    'group/update',
    async ({ groupId, groupData }, { rejectWithValue }) => {
        try {
            const data = await groupService.updateGroup(groupId, groupData);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to update group");
        }
    }
);

export const deleteGroup = createAsyncThunk(
    'group/delete',
    async (groupId, { rejectWithValue }) => {
        try {
            const data = await groupService.deleteGroup(groupId);
            return { groupId, data };
        } catch (error) {
            return rejectWithValue(error.message || "Failed to delete group");
        }
    }
);

const initialState = {
    list: {
        data: [],
        loading: false,
        error: null,
    },
    detail: {
        data: null,
        loading: false,
        error: null,
    },
    create: {
        loading: false,
        error: null,
        success: false,
    },
    update: {
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

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        clearGroupError: (state) => {
            state.list.error = null;
            state.detail.error = null;
            state.create.error = null;
            state.update.error = null;
            state.delete.error = null;
        },
        clearGroupDetail: (state) => {
            state.detail.data = null;
            state.detail.error = null;
        },
        clearGroupList: (state) => {
            state.list.data = [];
        },
        resetCreateStatus: (state) => {
            state.create.loading = false;
            state.create.error = null;
            state.create.success = false;
        },
        resetUpdateStatus: (state) => {
            state.update.loading = false;
            state.update.error = null;
            state.update.success = false;
        },
        resetDeleteStatus: (state) => {
            state.delete.loading = false;
            state.delete.error = null;
            state.delete.success = false;
        },
    },
    extraReducers: (builder) => {
        // Fetch All Groups
        builder
            .addCase(fetchAllGroups.pending, (state) => {
                state.list.loading = true;
                state.list.error = null;
            })
            .addCase(fetchAllGroups.fulfilled, (state, action) => {
                state.list.loading = false;
                state.list.data = action.payload || [];
            })
            .addCase(fetchAllGroups.rejected, (state, action) => {
                state.list.loading = false;
                state.list.error = action.payload;
            });

        // Fetch Group by ID
        builder
            .addCase(fetchGroupById.pending, (state) => {
                state.detail.loading = true;
                state.detail.error = null;
            })
            .addCase(fetchGroupById.fulfilled, (state, action) => {
                state.detail.loading = false;
                state.detail.data = action.payload || null;
            })
            .addCase(fetchGroupById.rejected, (state, action) => {
                state.detail.loading = false;
                state.detail.error = action.payload;
            });

        // Create Group
        builder
            .addCase(createGroup.pending, (state) => {
                state.create.loading = true;
                state.create.error = null;
                state.create.success = false;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.create.loading = false;
                state.create.success = true;
                // Add new group to list
                state.list.data.push(action.payload);
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.create.loading = false;
                state.create.error = action.payload;
                state.create.success = false;
            });

        // Update Group
        builder
            .addCase(updateGroup.pending, (state) => {
                state.update.loading = true;
                state.update.error = null;
                state.update.success = false;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.update.loading = false;
                state.update.success = true;
                // Update in list
                const index = state.list.data.findIndex(
                    (group) => group._id === action.payload._id
                );
                if (index !== -1) {
                    state.list.data[index] = action.payload;
                }
                // Update detail if it's the same group
                if (state.detail.data?._id === action.payload._id) {
                    state.detail.data = action.payload;
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.update.loading = false;
                state.update.error = action.payload;
                state.update.success = false;
            });

        // Delete Group
        builder
            .addCase(deleteGroup.pending, (state) => {
                state.delete.loading = true;
                state.delete.error = null;
                state.delete.success = false;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.delete.loading = false;
                state.delete.success = true;
                // Remove from list
                state.list.data = state.list.data.filter(
                    (group) => group._id !== action.payload.groupId
                );
                // Clear detail if it's the deleted group
                if (state.detail.data?._id === action.payload.groupId) {
                    state.detail.data = null;
                }
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.delete.loading = false;
                state.delete.error = action.payload;
                state.delete.success = false;
            });
    },
});

export const {
    clearGroupError,
    clearGroupDetail,
    clearGroupList,
    resetCreateStatus,
    resetUpdateStatus,
    resetDeleteStatus,
} = groupSlice.actions;

export default groupSlice.reducer;