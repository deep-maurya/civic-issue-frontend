import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 405 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token request
        const res = await axios.post<{ accessToken: string }>(
          'https://your-api.com/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Save new token
        localStorage.setItem('accessToken', newAccessToken);

        // Update headers & retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
