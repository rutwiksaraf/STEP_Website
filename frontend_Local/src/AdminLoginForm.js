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
  const [cropType, setCropType] = useState("corn");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCardClick = (type) => {
    setCropType(type);
  };

  const cropOptions = [
    { label: "Corn", value: "corn" },
    { label: "Cotton", value: "cotton" },
    // Add more options here
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

    if (username === "Step_admin27" && password === "ufifasabe27") {
      axios.post("/api/superadminlogin", formData).then((response) => {
        if (response.data.message === "Login successful") {
          localStorage.setItem("username", username);
          localStorage.setItem("cropType", "All");
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          window.location.href = "/admin";
        }
      });
    } else {
      axios
        .post("/api/adminlogin", formData)
        .then((response) => {
          if (response.data.message === "Login successful") {
            localStorage.setItem("username", username);
            localStorage.setItem("cropType", cropType);
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("token", response.data.accessToken);
            window.location.href = "/adminspage";
          } else {
            setErrorMessage(
              "Invalid credentials. Please check your username and password."
            );
          }
        })
        .catch(() => {
          setErrorMessage("An error occurred. Please try again later.");
        });
    }
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
      <Container maxWidth="sm">
        <Card
          elevation={5}
          sx={{
            borderRadius: "16px",
            padding: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // Align children in a row
                  flexWrap: "wrap", // Allow the items to wrap as needed
                  justifyContent: "center", // Center horizontally
                  alignItems: "center",
                  gap: 10
                }}
              >
                {cropOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      cropType === option.value ? "contained" : "outlined"
                    }
                    onClick={() => handleCardClick(option.value)}
                    sx={{
                      fontSize: "1.2rem",
                      padding: "12px 24px",
                      backgroundColor:
                        cropType === option.value ? "#2c3e50" : "transparent",
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
              </div>
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
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              <a
                href="/login"
                style={{ color: "#2c3e50", textDecoration: "none" }}
              >
                User Login
              </a>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AdminLoginForm;
