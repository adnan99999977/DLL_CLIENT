import { useState, useEffect } from "react";
import Loader from "./Loader"; 

const AppWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3200); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return children;
};

export default AppWrapper;
