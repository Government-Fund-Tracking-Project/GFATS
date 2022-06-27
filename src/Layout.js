import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

const Layout = () => {
  return (
    <body className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main class="flex-grow">
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer />
      </footer>
    </body>
  );
};

export default Layout;
