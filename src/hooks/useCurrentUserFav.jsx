import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import useAxios from "../api/useAxios";
import useCurrentUser from "./useCurrentUser";

const useCurrentUserFav = () => {
  const { user } = useCurrentUser();
  const [favorites, setFavorites] = useState([]);
  const [allFavorites, setAllFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosApi = useAxios();

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get(`/favorites?userId=${user._id}`);
        setFavorites(res.data);

        const fav = await axiosApi.get("/favorites");
        setAllFavorites(fav.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);
  return { favorites, allFavorites, loading, error, setFavorites };
};

export default useCurrentUserFav;
