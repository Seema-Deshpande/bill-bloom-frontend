import { fetchAPI } from "../api/apiClient.js";
import { AUTH_API } from "../config/apiConfig.js";


export async function loginUser(email, password) {
  return await fetchAPI(AUTH_API.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export const registerUser = async (userData) => {
   return  await fetchAPI(AUTH_API.REGISTER, {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

export const getMe = async () => {
    return await fetchAPI(AUTH_API.ME);
}

export default {
    login: loginUser,
    register: registerUser,
    getMe,
}