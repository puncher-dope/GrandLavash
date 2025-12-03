
'use client'
import { useEffect } from 'react';
import { useUser } from '@/app/lib/api/store/useUser';

export const useAuthCheck = () => {
  const { user, checkAuth } = useUser();

  useEffect(() => {
    const verifyAuth = async () => {
      console.log("🔍 Initial auth check...");
      console.log("Current user:", user);
      
      if (user) {
        console.log("User exists in state, verifying...");
        const isAuthenticated = await checkAuth();
        console.log("Auth verification result:", isAuthenticated);
      } else {
        console.log("No user in state, checking auth...");
        await checkAuth();
      }
    };

    verifyAuth();
  }, []);

  return { user };
};