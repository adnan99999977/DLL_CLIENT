// hooks/useAxios.js
import { useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const useAxios = () => {
  const { user } = useContext(AuthContext);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000",
      headers: { "Content-Type": "application/json" },
    });

    return instance;
  }, [user]);

  return axiosInstance;
};

export default useAxios;
