

import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

function ProtectedRoute({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwtToken = JSON.parse(sessionStorage.getItem("token"));
    setToken(jwtToken);
  }, []); 

  return token ? children : <LoginPage />;
}

export default ProtectedRoute;
