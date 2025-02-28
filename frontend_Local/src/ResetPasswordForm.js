import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Container, TextField } from "@mui/material";

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false); // State to track if there's an error

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetPasswordEndpoint = "/api/reset-password";

    axios
      .post(resetPasswordEndpoint, { token, newPassword })
      .then((response) => {
        setMessage("Your password has been reset successfully.");
        setError(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        setMessage("Failed to reset password. Please try again.");
        setError(true);
      });
  };

  return (
    <Container component="main" maxWidth="md">
      <form onSubmit={handleSubmit}>
        <TextField
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          label="New Password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
        {message && (
          <Alert
            severity={error ? "error" : "success"}
            style={{ marginTop: "20px" }}
          >
            {message}
          </Alert>
        )}
      </form>
    </Container>
  );
}

export default ResetPasswordForm;
