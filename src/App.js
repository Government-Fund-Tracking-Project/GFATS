import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Layout";

import {
  Home,
  ConnectWallet,
  Profile,
  ErrorPage,
  Signup,
  Contractors,
  ContactAdmin,
} from "./views";

import { Provinces, ProvincesList, ProvincesDetail } from "./views/admin";

const PrivateRoute = ({ component: Component }) => {
  let is_authenticate = Boolean(localStorage.getItem("wallet_address"));
  let role = localStorage.getItem("role");
  const roles = ["admin", "province", "contractor"];

  return is_authenticate === true && roles.includes(role) ? (
    Component
  ) : (
    <Navigate to="/connect-wallet"></Navigate>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/connect-wallet" element={<ConnectWallet />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          {/* <Route path="/connect-wallet" element={<ConnectWallet />}></Route> */}
          <Route
            path="/"
            element={<PrivateRoute component={<Layout />}></PrivateRoute>}
          >
            <Route index element={<Home />}></Route>
            <Route path="/profile" element={<Profile />}></Route>

            <Route path="/provinces/" element={<Provinces />}>
              <Route index element={<ProvincesList />}></Route>
              <Route path=":id" element={<ProvincesDetail />}></Route>
            </Route>

            <Route path="/contractors" element={<Contractors />}></Route>
          </Route>
          <Route path="/contact-admin" element={<ContactAdmin />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
