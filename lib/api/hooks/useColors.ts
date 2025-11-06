import { useState, useEffect, useCallback } from 'react';
import { colorsService } from '../services';
import type { Color, ColorCreateRequest } from '../types';

export function useColors(params?: {
  verified_only?: boolean;
  active_only?: boolean;
  finish_type?: string;
}) {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await colorsService.list(params);
      setColors(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch colors'));
      console.error('Error fetching colors:', err);
    } finally {
      setLoading(false);
    }
  }, [params?.verified_only, params?.active_only, params?.finish_type]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const createColor = useCallback(async (colorData: ColorCreateRequest): Promise<Color> => {
    try {
      const newColor = await colorsService.create(colorData);
      // Atualizar lista local
      setColors(prev => [newColor, ...prev]);
      return newColor;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create color');
    }
  }, []);

  return {
    colors,
    loading,
    error,
    refetch: fetchColors,
    createColor,
  };
}
