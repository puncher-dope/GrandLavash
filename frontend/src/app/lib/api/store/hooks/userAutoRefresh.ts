
import { useEffect } from 'react';
import { useUser } from '../useUser';

export const useAutoRefresh = () => {
  const { checkAuth, user } = useUser();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 14 * 60 * 1000); // 14 минут

    return () => clearInterval(interval);
  }, [user, checkAuth]);


};