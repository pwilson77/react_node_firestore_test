import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const loggedIn = useSelector((state) => state.loggedIn);

  if (!loggedIn) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default PrivateRoute;
