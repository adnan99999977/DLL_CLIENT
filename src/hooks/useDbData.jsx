import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import useAxios from "../api/useAxios";

const useDbData = () => {
  const { currentUser } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const axiosApi = useAxios();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
   const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };


  useEffect(() => {
    const fetchData = async () => {

      if (!currentUser?.email) return setLoading(true);
      try {
        // fetching user
        const userRes = await axiosApi.get("/users");
        setDbUser(userRes.data);

        

        // Fetch lessons for this user
        const lessonsRes = await axiosApi.get("/lessons");
        setLessons(lessonsRes.data);

        // fetching reported lessons
        const reportedLessonRes = await axiosApi.get("/lessonsReports");
        setReports(reportedLessonRes.data);

        // get contributors by email 


      } catch (err) {
        console.error("Failed to fetch user or lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);
    
  return { dbUser, lessons, reports, loading,formatDateTime };
};

export default useDbData;
