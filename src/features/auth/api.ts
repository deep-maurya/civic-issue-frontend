import api from '@/config/axios.config';
import {
  LoginCredentials,
  LoginResponse,
  registrationRequest,
} from '@/features/auth/type';

const login = async (LoginCredentials: LoginCredentials) => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  try {
    const response = await api.post<LoginResponse>('/users/login', {
      email: LoginCredentials.email,
      password: LoginCredentials.password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (data: registrationRequest) => {
  try {
    const response = await api.post('/users/register', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authApi = {
  login,
  logout,
  register,
};
