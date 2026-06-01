import apiClient from '../api/apiClient.js';
import { AUTH_API } from "../config/apiConfig.js";


export async function loginUser(email, password) {
  const res = await apiClient.post(AUTH_API.LOGIN, { email, password });
  return res.data
}

export const registerUser = async (userData) => {
  const res = await apiClient.post(AUTH_API.REGISTER, userData);
  return res.data
}

export const getMe = async () => {
    const res =  await apiClient.get(AUTH_API.ME);
    return res.data
}

export default {
    login: loginUser,
    register: registerUser,
    getMe,
}