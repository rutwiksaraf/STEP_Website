import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import Alert from "@mui/material/Alert";

function ForgotPasswordForm() {
  const [username, setUsername] = useState("");
  const [cropType, setCropType] = useState("corn");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        // Handle success, show a message if needed
        if (response.status === 200) {
          setSuccessMessage(
            response.data.message || "Password reset email sent successfully."
          );
        }
      })
      .catch((error) => {
        // Handle errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setErrorMessage(
            error.response.data.message ||
              "An error occurred while sending the password reset email."
          );
        } else if (error.request) {
          // The request was made but no response was received
          setErrorMessage(
            "The server did not respond. Please try again later."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          setErrorMessage("Error: " + error.message);
        }
      });
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://step.ifas.ufl.edu/media/stepifasufledu/images/banner-photos/Coverpage-Photo-3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh", // This sets the minimum height to 100% of the viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // This centers the form vertically
      }}
    >
      <Container component="main" maxWidth="sm">
        <div className="registration-container">
          <div className="registration-form">
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Forgot Password
            </Typography>
            {successMessage && (
              <Alert severity="success" style={{ marginBottom: "20px" }}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" style={{ marginBottom: "20px" }}>
                {errorMessage}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Crop Type</InputLabel>
                <Select
                  value={cropType}
                  label="Crop Type"
                  onChange={(e) => setCropType(e.target.value)}
                  required
                >
                  <MenuItem value="corn">Corn</MenuItem>
                  {/* <MenuItem value="cotton">Cotton</MenuItem> */}
                  {/* Add more crop types if needed */}
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
              <p style={{ textAlign: "justify" }}></p>
              <p textAlign="center">
                login page :{" "}
                <a href="/login" className="signUpLink">
                  User login
                </a>
              </p>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPasswordForm;
