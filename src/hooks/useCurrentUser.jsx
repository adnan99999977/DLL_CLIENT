import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import useAxios from "../api/useAxios";

const useCurrentUser = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosApi = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // ================= USER FETCH =================
        let userRes;
        try {
          userRes = await axiosApi.get("/users", {
            params: { email: currentUser.email },
          });
        } catch (err) {
          if (err.response?.status === 404) {
            console.warn("User not found, creating a new one...");
            const newUser = {
              email: currentUser.email,
              userName: currentUser.displayName,
              userImage: currentUser.photoURL,
              role: "user",
              isPremium: false,
              createdAt: new Date(),
            };
            console.log(newUser);
            const createRes = await axiosApi.post("/users", newUser);
            userRes = { data: createRes.data.result.ops[0] };
          } else {
            throw err;
          }
        }

        const fetchedUser = userRes.data;
        setUser(fetchedUser);

        // ================= LESSONS FETCH =================
        const lessonsRes = await axiosApi.get("/lessons", {
          params: { email: currentUser.email },
        });
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error("Failed to fetch user or lessons:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);
  return { user, lessons, loading, error };
};

export default useCurrentUser;
