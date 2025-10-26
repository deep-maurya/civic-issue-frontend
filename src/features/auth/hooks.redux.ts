// features/auth/hooks.redux.ts
import { useSelector, useDispatch } from 'react-redux';
import { logout, setCredentials } from './auth.slices';
import { AppDispatch, RootState } from '@/redux/store';

export function useAuthSelector() {
  return useSelector((state: RootState) => ({
    user: state.auth.user,
    role :state.auth.role,
    isLoggedIn: state.auth.isLoggedIn,
  }));
}

export function useAuthActions() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setCredentials: (user: any, role: "USER" | "ADMIN" | "WORKER", isLoggedIn:Boolean) =>
      dispatch(setCredentials({ user, role, isLoggedIn })),
    clearCredentials: () => dispatch(logout()),
  };
}
