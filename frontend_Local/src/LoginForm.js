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
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cropType, setCropType] = useState("corn");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cropOptions = [
    { label: "Corn", value: "corn" },
    { label: "Cotton", value: "cotton" },
  ];

  // Show error for 3s
  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => setErrorMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/login",
        { username, password, cropType },
        {
          // Resolve on 4xx so we can branch without triggering catch
          validateStatus: (s) => s < 500,
        }
      );

      if (response.status === 200 && response.data?.message === "Login successful") {
        localStorage.setItem("username", response.data.user.teamName);
        localStorage.setItem("cropType", response.data.user.cropType);
        localStorage.setItem("token", response.data.token);

        if (cropType === "corn") navigate("/welcome");
        else if (cropType === "cotton") navigate("/welcomecotton");
        return;
      }

      if (response.status === 400 || response.status === 401) {
        setErrorMessage(
          response.data?.message ??
            "Invalid credentials. Please check your Username, Password and Crop Type."
        );
        return;
      }

      setErrorMessage(response.data?.message ?? "Unable to log in right now. Please try again.");
    } catch (err) {

      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
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
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <Container maxWidth="sm">
        <Card
          elevation={5}
          sx={{ borderRadius: "16px", padding: 4, position: "relative", zIndex: 1 }}
        >
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
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage("")}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Crop Type:
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  {cropOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"                 // <-- make sure NOT a submit
                      variant={cropType === option.value ? "contained" : "outlined"}
                      onClick={() => setCropType(option.value)}
                      sx={{
                        fontSize: "1.2rem",
                        p: "12px 24px",
                        backgroundColor:
                          cropType === option.value ? "#2c3e50" : "transparent",
                        color: cropType === option.value ? "white" : "#2c3e50",
                        borderColor: "#2c3e50",
                        "&:hover": { backgroundColor: "#2c3e50", color: "white" },
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
                sx={{ mb: 2 }}
                autoComplete="username"
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
                sx={{ mb: 3 }}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#2c3e50",
                  color: "white",
                  fontSize: "1.2rem",
                  p: "12px 0",
                  "&:hover": { backgroundColor: "#1f2a36" },
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ display: "inline" }}>
                Not registered yet?{" "}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/register")}
                sx={{ color: "#2c3e50" }}
              >
                Sign up
              </Button>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/adminlogin")}
                sx={{ color: "#2c3e50" }}
              >
                Admin login
              </Button>
            </Typography>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{ color: "#2c3e50" }}
              >
                Forgot Password?
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginForm;
