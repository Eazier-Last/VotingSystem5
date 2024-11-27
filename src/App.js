import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Main from "./Main";
import VotePage from "./components/VotePage";
import ThankYouForm from "./components/ThankYouForm";
import ElectionHold from "./components/ElectionHold";

import { supabase } from "./components/client";

function App() {
  const [authType, setAuthType] = useState(null); 
  const [redirectTo, setRedirectTo] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const loadAuthState = async () => {
      const savedAuthType = localStorage.getItem("authType");
      const savedPath = localStorage.getItem("lastPath");
      if (savedAuthType) {
        setAuthType(savedAuthType);

        // Validate the session with Supabase
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData) {
          localStorage.removeItem("authType"); // Clear invalid state
          setAuthType(null);
        } else if (savedPath) {
          setRedirectTo(savedPath); // Restore last visited path
        }
      }
      setIsLoading(false);
    };

    loadAuthState();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authType"); // Clear localStorage on logout
    localStorage.removeItem("lastPath"); // Clear saved path
    setAuthType(null);
  };

  const updateAuthType = (type) => {
    setAuthType(type);
    if (type) {
      localStorage.setItem("authType", type);
    } else {
      localStorage.removeItem("authType");
    }
  };

  const PathSaver = () => {
    const location = useLocation();

    useEffect(() => {
      localStorage.setItem("lastPath", location.pathname); // Save the current path
    }, [location]);

    return null; // This component doesn't render anything
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <PathSaver /> {/* Tracks and saves the current path */}
        <Routes>
          <Route
            path="/"
            element={
              authType ? (
                <Navigate
                  to={redirectTo || (authType === "admin" ? "/main" : "/vote")}
                  replace
                />
              ) : (
                <Login setAuthType={updateAuthType} />
              )
            }
          />

          <Route
            path="/main"
            element={
              authType === "admin" ? (
                <Main onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/vote"
            element={
              authType === "user" ? (
                <VotePage setAuthType={updateAuthType} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/election-hold"
            element={<ElectionHold setAuthType={updateAuthType} />}
          />

          <Route
            path="/thank-you"
            element={<ThankYouForm setAuthType={updateAuthType} />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
