// features/auth/hooks.redux.ts
import { useSelector, useDispatch } from 'react-redux';
import { logout, setCredentials } from './auth.slices';
import { AppDispatch, RootState } from '@/redux/store';

export function useAuthSelector() {
  return useSelector((state: RootState) => ({
    user: state.auth.user,
    token: state.auth.token,
    isLoggedIn: !!state.auth.token,
  }));
}

export function useAuthActions() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setCredentials: (user: any, token: string) =>
      dispatch(setCredentials({ user, token })),
    clearCredentials: () => dispatch(logout()),
  };
}
