import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import useAxios from "../api/useAxios";

const useDbData = () => {
  const { currentUser } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navUser, setNavUser] = useState(null);

  const axiosApi = useAxios();

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.email) {
        setDbUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Logged-in user fetch
        const userRes = await axiosApi.get(`/users?email=${currentUser.email}`);
        setNavUser(userRes.data || null);

        const userRese = await axiosApi.get(`/users`);
        setDbUser(userRese.data || null);

        // Lessons
        const lessonsRes = await axiosApi.get(`/lessons`);
        setLessons(lessonsRes.data || []);

        // Reports
        const reportsRes = await axiosApi.get(
          `/reported-lessons?email=${currentUser.email}`
        );
        setReports(reportsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, axiosApi]);

  return { dbUser, navUser, lessons, reports, loading, formatDateTime };
};

export default useDbData;
