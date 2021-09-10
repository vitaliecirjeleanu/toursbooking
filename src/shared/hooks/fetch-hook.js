import { useState, useCallback } from 'react';

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async (url, options = { method: 'GET', body: null, headers: {} }) => {
      setIsLoading(true);

      try {
        const res = await fetch(url, {
          method: options.method,
          body: options.body,
          headers: options.headers,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setIsLoading(false);
        return data;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = () => setError(null);

  return { isLoading, error, sendRequest, clearError };
};
