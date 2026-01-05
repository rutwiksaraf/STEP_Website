import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Paper,
} from "@mui/material";

function UserDetails() {
  const username = localStorage.getItem("username");
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [cornuser1, setCornuser1] = useState([]);
  useEffect(() => {
    // Fetch users for the Corn crop from the API
    axios
      .post(
        "/api/get_corn_user",
        {
          teamName: teamName, // Send 'teamName' in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        setCornuser1(response.data);
        console.log(response.data);
        console.log(cornuser1);
      })
      .catch((error) => {
        console.error("Error fetching Corn users data:", error);
      });
  }, []);

  return (
    <Container>
      <h2>Welcome, {username}!</h2>
      <h4>User Details</h4>
      <p style={{ textAlign: "justify" }}>Username: {cornuser1[0].teamName}</p>
      {/* Change to teamName */}
      <p style={{ textAlign: "justify" }}>
        Captain First Name: {cornuser1[0].captainFirstName}
      </p>
      {/* Change to captainFirstName */}
      <p style={{ textAlign: "justify" }}>
        Captain Last Name: {cornuser1[0].captainLastName}
      </p>
      {/* Change to captainLastName */}
      <p style={{ textAlign: "justify" }}>Address 1: {cornuser1[0].address1}</p>
      <p style={{ textAlign: "justify" }}>Address 2: {cornuser1[0].address2}</p>
      <p style={{ textAlign: "justify" }}>City: {cornuser1[0].city}</p>
      <p style={{ textAlign: "justify" }}>State: {cornuser1[0].state}</p>
      <p style={{ textAlign: "justify" }}>Zip Code: {cornuser1[0].zipCode}</p>
      <p style={{ textAlign: "justify" }}>Country: {cornuser1[0].country}</p>
      <p style={{ textAlign: "justify" }}>Email: {cornuser1[0].email}</p>{" "}
      {/* Change to email */}
      <p style={{ textAlign: "justify" }}>Phone: {cornuser1[0].phone}</p>{" "}
      {/* Change to phone */}
      {/* Display other user details here */}
    </Container>
  );
}
export default UserDetails;
