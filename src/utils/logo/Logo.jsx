import { Link } from "react-router-dom";
import "./logo.css";

const Logo = () => {
  return (
    <Link to={"/"} className="logo md:pb-3 flex items-center">
      <img className="md:w-15 w-10" src="/bgremove.png" alt="" />
      <p className="text-3xl md:pt-3 flex font-bold text-primary">
        <span className="text-primary"> D</span>
        <span className="text-primary ">Life</span> Lessons
      </p>
    </Link>
  );
};

export default Logo;
