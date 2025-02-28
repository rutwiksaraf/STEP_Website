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

function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    const formData = { username, password };

    axios
      .post("/api/adminlogin", formData)
      .then((response) => {
        if (response.data.message === "Login successful") {
          localStorage.setItem("username", username);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          window.location.href = "/adminspage";
        } else {
          setErrorMessage("Login failed. Invalid credentials.");
        }
      })
      .catch(() => setErrorMessage("An error occurred. Please try again."));
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
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
              Admin Login
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
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
                Not an admin?{" "}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.href = "/login")}
                sx={{ color: "#2c3e50" }}
              >
                User Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminLoginForm;
