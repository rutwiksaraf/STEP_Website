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

function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [cropType, setCropType] = useState("corn");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const cropOptions = [
    { label: "Corn", value: "corn" },
    { label: "Cotton", value: "cotton" },
  ];

  useEffect(() => {
    let timer;
    if (successMessage || errorMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    axios
      .post("/api/forgot-password", {
        username,
        cropType,
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage(
            response.data.message ||
              "Password reset email sent successfully."
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(
            error.response.data.message ||
              "An error occurred while sending the password reset email."
          );
        } else if (error.request) {
          setErrorMessage("The server did not respond. Please try again later.");
        } else {
          setErrorMessage("Error: " + error.message);
        }
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
              Forgot Password
            </Typography>
            {successMessage && (
              <Alert severity="success" sx={{ marginBottom: 2 }}>
                {successMessage}
              </Alert>
            )}
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
                Submit
              </Button>
            </form>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ display: "inline" }}>
                Back to{" "}
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

export default ForgotPasswordForm;
