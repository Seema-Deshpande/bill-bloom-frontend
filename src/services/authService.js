import apiClient from '../api/apiClient.js';
import { AUTH_API } from "../config/apiConfig.js";
import { smartExtractData } from '../utils/extractApiData.js';

export async function loginUser(email, password) {
  const res = await apiClient.post(AUTH_API.LOGIN, { email, password });
  return smartExtractData(res);
}

export const registerUser = async (userData) => {
  const res = await apiClient.post(AUTH_API.REGISTER, userData);
  return smartExtractData(res);
}

export const getMe = async () => {
    const res =  await apiClient.get(AUTH_API.ME);
    return smartExtractData(res);
}

export default {
    login: loginUser,
    register: registerUser,
    getMe,
}