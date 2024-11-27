import React, { useState } from "react";
import "../App.css";
import "./Modals/Modals.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "./LCSC.png";
import "./Modals/login.css";

function Login({ setAuthType }) {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Simple check for studentNumber and password (no need for Supabase authentication)
    if (studentNumber === "admin" && password === "password") {
      setAuthType("admin");
      localStorage.setItem("authType", "admin");
      return;
    }

    // Check if studentNumber exists in your mock user data or simply allow access
    if (studentNumber && password) {
      setAuthType("user");
      localStorage.setItem("authType", "user");
    } else {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div>
      <div className="modal loginModal">
        <div className="modalContent login">
          <div>
            <h2 className="topLabel login">LOGIN FORM</h2>
          </div>

          <form onSubmit={handleLogin}>
            <div>
              <img
                className="LCSClogo"
                src={logo}
                alt="LC Student Council Logo"
              ></img>
              <Box
                component="form"
                sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    label="Student Number"
                    id="outlined-size-small"
                    size="small"
                    required
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                </div>
              </Box>
            </div>
            <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
              {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <div>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#1ab394",
                  marginTop: "10px",
                }}
              >
                Login
              </Button>
            </div>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
