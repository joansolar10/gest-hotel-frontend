import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useVerification = () => {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[useVerification] Usuario cambió:', user);
    
    if (user) {
      const verified = user.is_verified_dni === true;
      console.log('[useVerification] is_verified_dni del usuario:', verified);
      setIsVerified(verified);
    } else {
      setIsVerified(false);
    }
    
    setIsLoading(false);
  }, [user]); // ← Cambiar a solo [user] para que reaccione a cualquier cambio

  return { isVerified, isLoading };
};