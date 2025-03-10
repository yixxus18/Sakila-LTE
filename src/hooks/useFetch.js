// hooks/useFetch.js
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/fetchData';

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0); // Agregamos trigger

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchData(url);
        setData(Array.isArray(result) ? result : result.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [url, trigger]); // Agregamos trigger como dependencia

  // Creamos función refetch
  const refetch = () => setTrigger(prev => prev + 1);

  return { data, isLoading, error, refetch };
};

export default useFetch;