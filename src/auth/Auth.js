import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

function Auth() {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-card">
        {mode === "login" ? <Login /> : <Signup />}

        <p className="auth-toggle">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setMode("signup")}>Signup</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;
