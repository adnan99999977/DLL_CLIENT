// hooks/useAxios.js
import { useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const useAxios = () => {
  const { user } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000",
      headers: { "Content-Type": "application/json" },
    });

    // Attach request interceptor
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        } else {
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Attach response interceptor (optional, for logging or handling 401)
    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized request - token may be invalid");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: remove interceptors when memo is recalculated
    const cleanup = () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };

    // Add cleanup to instance (so component using this can call if needed)
    instance.cleanupInterceptors = cleanup;

    return instance;
  }, [user]);

  return axiosInstance;
};

export default useAxios;
