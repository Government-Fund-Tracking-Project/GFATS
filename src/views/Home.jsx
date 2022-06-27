import React from "react";

const Home = ({ role }) => {
  console.log("role :>> ", role);
  return <div>{localStorage.getItem("role")}</div>;
};

export default Home;
