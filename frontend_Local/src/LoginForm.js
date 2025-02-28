import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cropType, setCropType] = useState("corn");
  const [errorMessage, setErrorMessage] = useState("");

  const cropOptions = [
    { label: "Corn", value: "corn" },
    { label: "Cotton", value: "cotton" },
  ];

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { username, password, cropType };

    axios
      .post("/api/login", formData)
      .then((response) => {
        console.log("Response from server:", response.data);

        if (response.data.message === "Login successful") {
          localStorage.setItem("username", response.data.user.teamName);
          localStorage.setItem("cropType", response.data.user.cropType);
          localStorage.setItem("token", response.data.token);

          if (cropType === "corn") {
            window.location.href = "/welcome";
          } else if (cropType === "cotton") {
            window.location.href = "/welcomecotton";
          }
        } else {
          setErrorMessage(
            "Invalid credentials. Please check your username and password."
          );
        }
      })
      .catch(() => {
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative", // Add position relative to hold waves
        overflow: "hidden",
      }}
    >

      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <Container maxWidth="sm">
        <Card elevation={5} sx={{ borderRadius: "16px", padding: 4, position: "relative", zIndex: 1 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "#2c3e50", fontWeight: "bold" }}
            >
              Login
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Crop Type:
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  {cropOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={cropType === option.value ? "contained" : "outlined"}
                      onClick={() => setCropType(option.value)}
                      sx={{
                        fontSize: "1.2rem",
                        padding: "12px 24px",
                        backgroundColor: cropType === option.value ? "#2c3e50" : "transparent",
                        color: cropType === option.value ? "white" : "#2c3e50",
                        borderColor: "#2c3e50",
                        "&:hover": {
                          backgroundColor: "#2c3e50",
                          color: "white",
                        },
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                variant="outlined"
                sx={{ marginBottom: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#2c3e50",
                  color: "white",
                  fontSize: "1.2rem",
                  padding: "12px 0",
                  "&:hover": { backgroundColor: "#1f2a36" },
                }}
              >
                Log In
              </Button>
            </form>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ display: "inline" }}>
                Not registered yet?{" "}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.href = "/register")}
                sx={{ color: "#2c3e50" }}
              >
                Sign up
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
              <a
                href="/adminlogin"
                style={{ color: "#2c3e50", textDecoration: "none" }}
              >
                Admin login
              </a>
            </Typography>
            <Typography variant="body2" align="center" sx={{ marginTop: 1 }}>
              <a
                href="/forgot-password"
                style={{ color: "#2c3e50", textDecoration: "none" }}
              >
                Forgot Password?
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginForm;
