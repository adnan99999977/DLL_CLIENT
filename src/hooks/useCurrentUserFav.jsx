// hooks/useCurrentUserFav.js
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import useAxios from "../api/useAxios";
import useCurrentUser from "./useCurrentUser";

const useCurrentUserFav = () => {
  const { user } = useCurrentUser();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosApi = useAxios();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    axiosApi
      .get(`/favorites?userId=${user._id}`)
      .then((res) => setFavorites(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [user]);

  return { favorites, loading, error, setFavorites };
};

export default useCurrentUserFav;
