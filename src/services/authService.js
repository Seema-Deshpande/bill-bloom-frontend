import axios from 'axios'
import { AUTH_API } from "../config/apiConfig.js";


export async function loginUser(email, password) {
  return await axios.post(AUTH_API.LOGIN, { email, password });
}

export const registerUser = async (userData) => {
   return  await axios.post(AUTH_API.REGISTER, userData);
}

export const getMe = async () => {
    return await axios.get(AUTH_API.ME);
}

export default {
    login: loginUser,
    register: registerUser,
    getMe,
}