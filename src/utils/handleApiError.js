//simple utility to handle API errors, especially 401 (unauthorized)

export const handleApiError = (error) => {

    if (error.response && error.response.status === 401) {
        // Clear user session on unauthorized error
        localStorage.removeItem("billBloomToken");
        localStorage.removeItem("billBloomUser");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
    }

    //Return the error message for other errors

    return error.response?.data?.message || error.response?.data?.error || error.message || "An unexpected error occurred.";
}