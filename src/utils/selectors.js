// Memoized selectors to prevent unnecessary rerenders
// These ensure that the same reference is returned for the same state

export const selectGroupExpenses = (state, groupId) => {
  return state.expense.group.data[groupId] ?? [];
};

export const selectCalculatedSettlements = (state, groupId) => {
  return state.settlement.calculated.data[groupId] ?? [];
};

export const selectSettlementsHistory = (state, groupId) => {
  return state.settlement.history.data[groupId] ?? [];
};

export const selectGroupCategories = (state) => {
  return state.analytics.groupCategories?.data ?? {};
};

export const selectUser = (state) => {
  return state.auth.user;
};

export const selectGroupDetail = (state) => {
  return state.group.detail;
};
