import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
} from "@mui/material";

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAdminData = async () => {
    try {
      axios
        .get("/api/getAdmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setAdmins(response.data);
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch the admin data when the component mounts
    fetchAdminData();
  }, []);

  const handleDelete = (adminId) => {
    axios
      .delete(`/api/deleteAdmin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Remove the admin from the state to update the UI
        fetchAdminData();
      })
      .catch((error) => {
        console.error("Error deleting admin:", error);
        // Optionally, show an error message to the user
        setErrorMessage("Failed to delete user.");
      });
  };

  return (
    <Container maxWidth="90%">
      <div>
        <h4>Manage Admins</h4>
        <TableContainer component={Paper}>
          <Table aria-label="admin table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Crops</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell component="th" scope="row">
                    {admin.username}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>
                    {admin.crops.map((crop, index) => (
                      <span key={index}>
                        {crop.name}
                        {index < admin.crops.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default AdminList;
