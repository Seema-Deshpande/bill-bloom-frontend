//API Endpoint configuration
//All paths are relative - the base URL is handled by apiClient.js

//Authentocation API Endpoints

export const AUTH_API = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
};

//Group API Endpoints

export const GROUP_API = {
    BASE: "/groups",
    DETAIL: (groupId) => `/groups/${groupId}`,
    SETTLEMENTS: (groupId) => `/groups/${groupId}/settlements`
};

//Expense API Endpoints

export const EXPENSE_API = {
    BASE: "/expenses",
    PERSONAL: "/expenses/personal",
    DETAIL: (expenseId) => `/expenses/${expenseId}`,
    GROUP: (groupId) => `/expenses/groups/${groupId}`,
};

//Analytics API Endpoints

export const ANALYTICS_API  = {
   PERSONAL: "/analytics/personal",
   GROUP_SPENDING: "/analytics/groups",
   GROUP_CATEGORIES: (groupId) => `/analytics/groups/${groupId}/categories`,
   PERSONAL_CATEGORIES: "/analytics/personal/categories",

};


// Settlement API Endpoints

export const SETTLEMENT_API = {
    BASE: "/settlements",
    LIST: (groupId) => `/settlements/group/${groupId}`,
    CALCULATE: (groupId) => `/settlements/settleGroup/${groupId}`,
};  

// User API Endpoints

export const USER_API = {
    BASE: "/users",
    DETAIL: (userId) => `/users/${userId}`,
    SEARCH: (query) => `/users/search?q=${encodeURIComponent(query)}`,
};

// AI API Endpoints

export const AI_API = {
    PARSE_EXPENSE: "/ai/parse-expense",
    ANALYSE_PERSONAL: "/ai/analyse-personal",
    SCAN_BILL: "/ai/scan-bill",
};