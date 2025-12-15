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

    instance.interceptors.request.use(
      async (config) => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            const token = await currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (err) {
          console.warn("No user logged in, skipping token", err);
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
