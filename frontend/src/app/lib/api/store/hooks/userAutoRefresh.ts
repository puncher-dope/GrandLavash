// hooks/useAutoRefresh.ts
import { useEffect } from 'react';
import { useUser } from '../useUser';

export const useAutoRefresh = () => {
  const { checkAuth, user } = useUser();

  useEffect(() => {
    if (!user) return;

    // Проверяем аутентификацию каждые 14 минут (чаще чем 15 минут expiry)
    const interval = setInterval(() => {
      console.log('Auto-refreshing user auth...');
      checkAuth();
    }, 14 * 60 * 1000); // 14 минут

    return () => clearInterval(interval);
  }, [user, checkAuth]);


};