import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  Container,
  Card, // Import Card from Material-UI
  CardContent, // Import CardContent from Material-UI
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios"; // Import Axios for making HTTP requests

function CottonSeedingRateForm() {
  const [seedingRate, setSeedingRate] = useState("");
  const [seedingMethod, setSeedingMethod] = useState("");

  const [notes, setNotes] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const teamName = localStorage.getItem("username");
  const [submittedForms, setSubmittedForms] = useState([]);
  const token = localStorage.getItem("token");

  const seedingOptions = ["29000", "30000", "32000", "36000"];

  const seedingMethods = ["Hill Drop", "Single Drop"];

  const handleSeedingClick = (selectedSeeding) => {
    setSeedingRate(selectedSeeding);
  };

  const handleSeedingMethodClick = (selectedMethod) => {
    setSeedingMethod(selectedMethod);
  };

  const fetchSubmittedForms = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.post(
        "/api//getCottonseedingForms",
        { username }, // Send username as part of the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Update the state with the fetched data
        setSubmittedForms(response.data);
      } else {
        console.error("Failed to fetch submitted forms data");
      }
    } catch (error) {
      console.error("Error fetching submitted forms data:", error);
    }
  };

  useEffect(() => {
    // Fetch the submitted forms data for the logged-in user

    // Call the fetch function when the component mounts
    fetchSubmittedForms();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the backend
    const formData = {
      seedingRate,
      notes,
      teamName,
      seedingMethod,
    };

    try {
      // Make an HTTP POST request to your backend API using Axios
      const response = await axios.post(
        "/api/cottonseedingratesubmit", // Replace with your actual backend URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Form submission was successful
        setStatusMsg("Form updated successfully");
        fetchSubmittedForms();
        // window.location.reload();
      } else {
        // Form submission failed
        setStatusMsg("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setStatusMsg("Form submission failed");
    }
  };

  const isSeedingRateSelected = submittedForms.length > 0;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Seeding Rate Form
      </Typography>
      <p style={{ textAlign: "justify" }}>
        The 2025 STEP cotton contest offer the following seeding rates:
      </p>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                paddingBottom: "20px",
              }}
            >
              {seedingOptions.map((option) => (
                <Card
                  key={option}
                  onClick={() =>
                    !isSeedingRateSelected && handleSeedingClick(option)
                  }
                  sx={{
                    cursor: isSeedingRateSelected ? "not-allowed" : "pointer",
                    pointerEvents: isSeedingRateSelected ? "none" : "auto",
                    opacity: isSeedingRateSelected ? 0.6 : 1,
                    margin: "4px",
                    padding: "10px 16px",
                    backgroundColor:
                      seedingRate === option ? "#fa4616" : "#F5F5F5",
                    border:
                      seedingRate === option
                        ? "2px solid rgb(255, 255, 255)"
                        : "2px solid rgb(37, 106, 185)",
                    borderRadius: "12px",
                    color: seedingRate === option ? "white" : "#333",
                    boxShadow:
                      seedingRate === option
                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                        : "none",
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    textAlign: "center", // Ensures text stays centered
                    height: "50px", // Fixed height for better alignment
                    "&:hover": {
                      backgroundColor:
                        seedingRate === option ? "#d73a12" : "#E0E0E0",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">{option} Seeds/Acre</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>

            <br></br>
            <Typography variant="h5" gutterBottom>
              Method
            </Typography>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                paddingBottom: "20px",
              }}
            >
              {seedingMethods.map((option) => (
                <Card
                  key={option}
                  onClick={() => !isSeedingRateSelected && handleSeedingMethodClick(option)}
                  sx={{
                    cursor: isSeedingRateSelected ? "not-allowed" : "pointer",
                    pointerEvents: isSeedingRateSelected ? "none" : "auto",
                    opacity: isSeedingRateSelected ? 0.6 : 1,
                    margin: "4px",
                    padding: "10px 16px",
                    backgroundColor:
                      seedingMethod === option ? "#fa4616" : "#F5F5F5",
                    border:
                      seedingMethod === option
                        ? "2px solid rgb(255, 255, 255)"
                        : "2px solid rgb(37, 106, 185)",
                    borderRadius: "12px",
                    color: seedingMethod === option ? "white" : "#333",
                    boxShadow:
                      seedingMethod === option
                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                        : "none",
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    textAlign: "center", // Ensures text stays centered
                    height: "50px", // Fixed height for better alignment
                    "&:hover": {
                      backgroundColor:
                        seedingMethod === option ? "#d73a12" : "#E0E0E0",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">{option}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="seedingrate-notes-input"
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              id="seedingrate-submit"
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSeedingRateSelected || !seedingMethod || !seedingRate} // Disable button if no seeding rate is selected
            >
              Submit (This cannot be changed after submission)
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Typography variant="subtitle1" id="seedingrate-status-msg">
              {statusMsg}
            </Typography>
          </Grid>
        </Grid>
      </form>
      {submittedForms.length > 0 && (
        // <div>
        //   <Typography variant="h5" gutterBottom>
        //     Submitted Forms
        //   </Typography>
        //   {submittedForms.map((form, index) => (
        //     <Card key={index} sx={{ marginBottom: 2 }}>
        //       <CardContent>
        //         <Typography variant="body1">
        //           Cost: ${form.seedingRate} seedingRate
        //         </Typography>
        //         <Typography variant="body2">Notes: {form.notes}</Typography>
        //         <Typography variant="body2">
        //           Team Name: {form.teamName}
        //         </Typography>
        //       </CardContent>
        //     </Card>
        //   ))}
        // </div>
        <div>
          <Typography variant="h5" gutterBottom>
            Submitted Data
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Seeding Rate</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Notes</TableCell>
                  {/* <TableCell>Team Name</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {submittedForms.map((form, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>${form.seedingRate}</TableCell>
                    <TableCell>{form.seedingMethod}</TableCell>
                    <TableCell>{form.notes}</TableCell>
                    {/* <TableCell>{form.teamName}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Container>
  );
}

export default CottonSeedingRateForm;
