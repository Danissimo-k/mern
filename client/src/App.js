import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import "materialize-css";
import { Navbar } from "./components/navbar";
import { Loader } from "./components/loader";

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuntificated = !!token;
  const routes = useRoutes(isAuntificated);

  if (!ready){
      <Loader />
  }
  
  return (
    <AuthContext.Provider
      value={{
        token,
        logout,
        login,
        userId,
        isAuntificated,
      }}
    >
      <Router>
        {isAuntificated && <Navbar />}
        <div className="container">{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
