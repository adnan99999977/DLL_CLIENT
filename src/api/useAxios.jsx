// hooks/useAxios.js
import { useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const { user } = useContext(AuthContext);
  const auth = getAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://dll-server.vercel.app",
      headers: { "Content-Type": "application/json" },
    });

    // attach token automatically
    instance.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await auth.currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [user, auth]);

  return axiosInstance;
};

export default useAxios;
