import { useMutation } from '@tanstack/react-query';
import { authApi } from './api';
import {
  LoginCredentials,
  LoginResponse,
  registrationRequest,
  RegistrationResponse,
} from './type';
import { useAuthActions } from './hooks.redux';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Router from 'next/dist/shared/lib/router/router';

const useLoginMutation = () => {
  const { setCredentials } = useAuthActions();
  const router = useRouter();

  return useMutation<LoginResponse, any, LoginCredentials>({
    mutationFn: async (credentials) => {
      const res = await authApi.login(credentials);
      if (res.status!=='success' || !res.user) {
        throw res.message || 'Login failed';
      }
      return res;
    },
    onSuccess: (res) => {
      if (res.user) {
        setCredentials(res.user, "USER", true);
        toast.success('Login Successful');
        router.push('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Login failed');
      throw error?.response?.data?.message || 'Login failed';
    },
  });
};

const useRegistrationMutation = () => {
  const router = useRouter();
  return useMutation<RegistrationResponse, any, registrationRequest>({
    mutationFn: async (data) => {
      const res = await authApi.register(data);
      if (res.status!=='success' || !res.user) {
        throw res.message || 'Registration failed';
      }
      return res;
    },
    onSuccess: (res) => {
      router.push('/auth/login');
      toast.success('Registration Successful');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Registration failed');
      throw error?.response?.data?.message || 'Registration failed';
    },
  });
};

const useLogoutMutation = () => {
  const { clearCredentials } = useAuthActions();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      clearCredentials();
      localStorage.clear();
    },
    onError: (error: any) => {
      throw error?.response?.data?.message || 'Logout failed';
    },
  });
};

export const authMutations = {
  login: useLoginMutation,
  register: useRegistrationMutation,
  logout: useLogoutMutation,
};
