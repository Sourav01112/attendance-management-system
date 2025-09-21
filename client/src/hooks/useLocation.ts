import { useState, useCallback } from 'react';
import { getLocationCoordinates } from '@/utils/helpers';
import type { LocationCoords, UseLocationReturn } from '@/types';



export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoords> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const coords = await getLocationCoordinates();
      setLocation(coords);
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
  };
};