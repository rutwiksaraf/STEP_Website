import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const [adminDetails, setAdminDetails] = useState(null);
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const adminId = decoded.id; // Replace 'id' with the actual key used in your token
      console.log(adminId);
      axios
        .get(`/api/adminDetails?adminId=${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((response) => {
          setAdminDetails(response.data);
          console.log("Admin Details");
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching admin details:", error);
        });
    }
  }, []);

  const handleHomeClick = () => {
    navigate("/adminspage");
  };

  if (!adminDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          padding: 20,
          margin: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome, {adminDetails.username}!
        </Typography>
        <Button variant="contained" color="primary" onClick={handleHomeClick}>
          Admin Home
        </Button>
      </Paper>
      <Paper
        elevation={2}
        style={{
          padding: 20,
          margin: 20,
        }}
      >
        <h1>Admin Details</h1>
        <p style={{ textAlign: "justify" }}></p>
        <p style={{ textAlign: "justify" }}>
          Username: {adminDetails.username}
        </p>
        <p style={{ textAlign: "justify" }}>Email: {adminDetails.email}</p>
        <p style={{ textAlign: "justify" }}>
          Mobile Number: {adminDetails.phone}
        </p>
        {/* Display other admin details */}
      </Paper>
    </div>
  );
}

export default AdminProfile;
