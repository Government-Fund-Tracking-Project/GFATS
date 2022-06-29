import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Home = () => {
  useEffect(() => {
    const user = localStorage.getItem("role").toUpperCase();
    toast.info(`You are logged in as ${user}`);
  }, []);
  return <div>{localStorage.getItem("role")}</div>;
};

export default Home;
