import { useEffect, useState } from "react";

/**
 * Hook pour retarder la mise à jour d'une valeur (utile pour les recherches)
 * @param value La valeur à retarder
 * @param delay Le délai en millisecondes
 * @returns La valeur retardée
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurer le timer pour mettre à jour la valeur après le délai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoyer le timer si la valeur change avant le délai
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
