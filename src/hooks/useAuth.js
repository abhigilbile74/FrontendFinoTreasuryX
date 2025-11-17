import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { restoreSession } from '../store/slices/authSlice';
import { axiosInstance } from '../api/axiosInstance';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  // Restore user session on mount if token exists
  useEffect(() => {
    if (accessToken && !user) {
      const restoreUserSession = async () => {
        try {
          const response = await axiosInstance.get('/auth/user/');
          dispatch(restoreSession(response.data));
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      };
      restoreUserSession();
    }
  }, [accessToken, user, dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};


