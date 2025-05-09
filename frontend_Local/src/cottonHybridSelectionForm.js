import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  Container,
  Card, // Import Card from Material-UI
  CardContent, // Import CardContent from Material-UI
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios"; // Import Axios for making HTTP requests

function CottonHybridForm() {
  const [hybrid, setHybrid] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const teamName = localStorage.getItem("username");
  const [submittedForms, setSubmittedForms] = useState([]);
  const token = localStorage.getItem("token");

  const hybridOptions = [
    { name: "NG3195B3XF", cost: 765 },
    { name: "NG4190B3XF", cost: 740 },
    { name: "PHY411W3FE", cost: 720 },
    { name: "PHY415W3FE", cost: 720 },
    { name: "DP2038B3XF", cost: 765 },
    { name: "DP2414B3TXF", cost: 815 },
    { name: "DP2522NRB3TXF", cost: 815 },
    { name: "DP2537B3TXF", cost: 815 },
    { name: "DP2127B3XF", cost: 690 },
    { name: "DP2333B3XF", cost: 770 },
    { name: "DP2328B3TXF", cost: 825 },
    { name: "Others", cost: null },
  ];

  const hybridCosts = {
    NG3195B3XF: "765.00",
    NG4190B3XF: "740.00",
    PHY411W3FE: "720.00",
    PHY415W3FE: "720.00",
    DP2038B3XF: "765.00",
    DP2414B3TXF: "815.00",
    DP2522NRB3TXF: "815.00",
    DP2537B3TXF: "815.00",
    DP2127B3XF: "690.00",
    DP2333B3XF: "770.00",
    DP2328B3TXF: "825.00",
  };

  const handleHybridClick = (selectedHybridName) => {
    setHybrid(selectedHybridName);
    const found = hybridOptions.find((h) => h.name === selectedHybridName);
    if (found && found.cost) {
      setCost(found.cost.toString());
    } else {
      setCost("");
    }
  };

  const fetchSubmittedForms = async () => {
    try {
      const username = localStorage.getItem("username");
      const response = await axios.post(
        "/api/getCottonHybridSubmittedForms",
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
      hybrid,
      cost,
      notes,
      teamName,
    };

    try {
      // Make an HTTP POST request to your backend API using Axios
      const response = await axios.post(
        "/api/cottonhybridsubmit", // Replace with your actual backend URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Form submission was successful
        fetchSubmittedForms();
        setStatusMsg("Form submitted successfully");
      } else {
        // Form submission failed
        setStatusMsg("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setStatusMsg("Form submission failed");
    }
  };

  const isHybridSubmitted = submittedForms.length > 0;

  return (
    <Container>
      <Grid item xs={12}>
        <Typography variant="h5">Hybrids to use:</Typography>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {hybridOptions.map((option) => (
            <Card
              key={option.name}
              onClick={() =>
                !isHybridSubmitted && handleHybridClick(option.name)
              }
              sx={{
                cursor: isHybridSubmitted ? "not-allowed" : "pointer",
                pointerEvents: isHybridSubmitted ? "none" : "auto",
                opacity: isHybridSubmitted ? 0.6 : 1,
                margin: "4px",
                padding: "10px 16px",
                backgroundColor: hybrid === option.name ? "#fa4616" : "#F5F5F5",
                border:
                  hybrid === option.name
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "12px",
                color: hybrid === option.name ? "white" : "#333",
                boxShadow:
                  hybrid === option.name
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
                    hybrid === option.name ? "#d73a12" : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body2">
                  {option.name}: {option.cost ? `$${option.cost}` : ""}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Grid>
      <Typography variant="h4" gutterBottom>
        My Form
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              <label
                style={{
                  display: "inline-block",
                  marginRight: "16px",
                  alignContent: "center",
                }}
              >
                Hybrid
              </label>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="hybrid-input"
              label="Hybrid"
              variant="outlined"
              fullWidth
              value={hybrid}
              onChange={(e) => setHybrid(e.target.value)}
              placeholder="Hybrid"
              required
            />
          </Grid>
          <Grid item xs={12}>
            {hybrid === "Others" || !hybridOptions.includes(hybrid) ? (
              <>
                <TextField
                  id="cost-input"
                  label="Cost"
                  variant="outlined"
                  fullWidth
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="Cost"
                  required
                />
                <Typography variant="body2" color="textSecondary">
                  $/bag
                </Typography>
              </>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="notes-input"
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
              id="hybrid-selection-submit"
              variant="contained"
              color="primary"
              type="submit"
              disabled={isHybridSubmitted}
            >
              Submit (This cannot be changed once submitted)
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Typography variant="subtitle1" id="hybrid-status-msg">
              {statusMsg}
            </Typography>
          </Grid>
        </Grid>
      </form>
      {/* {submittedForms.length > 0 && (
        <div>
          <Typography variant="h5" gutterBottom>
            Submitted Data
          </Typography>
          {submittedForms.map((form, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">Hybrid: {form.hybrid}</Typography>
                <Typography variant="body1">
                  Cost: ${form.cost} per bag
                </Typography>
                <Typography variant="body2">Notes: {form.notes}</Typography>
                <Typography variant="body2">
                  Team Name: {form.teamName}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  ); */}
      {submittedForms.length > 0 && (
        <div>
          <strong>
            {" "}
            <Typography variant="h5" gutterBottom>
              Submitted Data
              <br></br>
            </Typography>{" "}
          </strong>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Hybrid</b>
                </TableCell>
                <TableCell>
                  <b>Cost per Bag</b>
                </TableCell>
                <TableCell>
                  <b>Notes</b>
                </TableCell>
                {/* <TableCell>
                    <b>Team Name</b>
                  </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedForms.map((form, index) => {
                const isPredefined = hybridOptions.some(
                  (h) => h.name === form.hybrid && h.cost
                );
                return (
                  <TableRow key={index}>
                    <TableCell>{form.hybrid}</TableCell>
                    <TableCell>
                      {isPredefined ? `Default $${form.cost}` : `$${form.cost}`}
                    </TableCell>
                    <TableCell>{form.notes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default CottonHybridForm;
