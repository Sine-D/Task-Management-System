import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMe, login, register } from '../api/authApi';
import { setAuth, logout as logoutAction } from '../store/slices/authSlice';

const AuthContext = createContext(null);

const normalizeError = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const bootstrapAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await getMe();
      setUser(data.user);
      dispatch(setAuth({ user: data.user, token }));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      dispatch(logoutAction());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const handleAuthSuccess = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    dispatch(setAuth(data));
    setAuthError('');
  };

  const registerUser = async (payload) => {
    try {
      const data = await register(payload);
      handleAuthSuccess(data);
      return { ok: true };
    } catch (error) {
      const message = normalizeError(error);
      setAuthError(message);
      return { ok: false, message };
    }
  };

  const loginUser = async (payload) => {
    try {
      const data = await login(payload);
      handleAuthSuccess(data);
      return { ok: true };
    } catch (error) {
      const message = normalizeError(error);
      setAuthError(message);
      return { ok: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    dispatch(logoutAction());
    setAuthError('');
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      registerUser,
      loginUser,
      logout,
    }),
    [user, isLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};
