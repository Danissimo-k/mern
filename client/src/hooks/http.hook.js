import React, { useState, useCallback }  from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
        setLoading(true)
      try {
          if (body) {
              body = JSON.stringify(body)
              headers['Content-Type'] = 'application/json'
          }
        //   console.log('client/src/hooks/http.hook.js')
        const response = await fetch(url, {
          method,
          body,
          headers
        });
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Что-то не так в хуке')
        }

        setLoading(false)
        // console.log("hooks data",data)
        return data

      } catch (e) {
        setLoading(false)
        setError(e.message)
        throw e
      }
    },
    []
  );
  const clearError = useCallback( () => {
     setError(null) 
  }, [])
  return { loading, request,error, clearError };
};
