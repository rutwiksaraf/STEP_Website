import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";

function InsuranceSelectionForm() {
  const [coverage, setCoverage] = useState("");
  const [level, setLevel] = useState("");
  const [formData, setFormData] = useState([]);
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const handleCardClick = (value) => {
    setCoverage(value);
  };

  const insuranceLevel = [
    "50%",
    "55%",
    "60%",
    "65%",
    "70%",
    "75%",
    "80%",
    "85%",
  ];

  const handleLevelCardClick = (selectedLevel) => {
    setLevel(selectedLevel);
  };

  // Fetch existing insurance selection data for the user
  const fetchInsuranceSelectionData = () => {
    axios
      .post(
        "/api/getInsuranceSelectionForms",
        {
          username: teamName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setFormData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Fetch existing insurance selection data for the user when the component mounts
  useEffect(() => {
    fetchInsuranceSelectionData();
  }, [teamName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to be sent
      const formDataToSubmit = {
        teamName: teamName,
        coverage: coverage,
        level: level,
      };

      // Send a POST request to your backend endpoint
      const response = await axios
        .post("/api/insurancesubmit", formDataToSubmit, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((response) => {
          // Handle the successful response if needed
          if (response.status === 200) {
            console.log("Application data sent to the backend successfully");
            fetchInsuranceSelectionData();
          } else {
            console.error("Failed to send application data to the backend");
          }
        })
        .catch((error) => {
          // Handle errors
          console.error("Error submitting form:", error);
        });

      // Handle the successful response if needed

      // Fetch updated data after submission
    } catch (error) {
      // Handle errors
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container maxWidth="100%">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          {/* Cards for selecting contract type */}
          <Card
            onClick={() => handleCardClick("Yield Protection")}
            sx={{
              cursor: "pointer",
              margin: "4px",
              padding: "10px 16px",
              backgroundColor:
                coverage === "Yield Protection" ? "#fa4616" : "#F5F5F5",
              border:
                coverage === "Yield Protection"
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: coverage === "Yield Protection" ? "white" : "#333",
              boxShadow:
                coverage === "Yield Protection"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  : "none",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "50px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor:
                  coverage === "Yield Protection" ? "#d73a12" : "#E0E0E0",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="body2">Yield Protection</Typography>
            </CardContent>
          </Card>

          <Card
            onClick={() => handleCardClick("Revenue Protection")}
            sx={{
              cursor: "pointer",
              margin: "4px",
              padding: "10px 16px",
              backgroundColor:
                coverage === "Revenue Protection" ? "#fa4616" : "#F5F5F5",
              border:
                coverage === "Revenue Protection"
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: coverage === "Revenue Protection" ? "white" : "#333",
              boxShadow:
                coverage === "Revenue Protection"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  : "none",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "50px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor:
                  coverage === "Revenue Protection" ? "#d73a12" : "#E0E0E0",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="body2">Revenue Protection</Typography>
            </CardContent>
          </Card>
        </div>
        <p style={{ textAlign: "justify" }}></p>
        {/* <Typography variant="h6" gutterBottom>
          Insurance Selection
        </Typography> */}
        <div className="field">
          <div className="block control">
            <TextField
              id="select-insurance-coverage"
              name="coverage"
              label="Plan"
              variant="outlined"
              fullWidth
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              placeholder="Plan"
              required
            />
          </div>
          <br />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* Cards for selecting amount */}
            <Card
              sx={{
                cursor: "pointer",
                margin: "4px",
                padding: "10px 16px",
                backgroundColor: "white",
                border: "2px solid rgb(37, 106, 185)", // Set default border color
                borderRadius: "12px",
                color: "#333",
                boxShadow: "none",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "50px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#E0E0E0", // Light grey on hover
                  transform: "scale(1.05)", // Slight scale effect on hover
                },
              }}
            >
              <CardContent>
                <Typography variant="body2">Level</Typography>
              </CardContent>
            </Card>

            {insuranceLevel.map((option) => (
              <Card
              key={option}
              onClick={() => handleLevelCardClick(option)}
              sx={{
                cursor: "pointer",
                margin: "4px",
                padding: "10px 16px",
                backgroundColor: level === option ? "#fa4616" : "#F5F5F5",
                border: level === option
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
                borderRadius: "12px",
                color: level === option ? "white" : "#333",
                boxShadow: level === option
                  ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  : "none",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                textAlign: "center", // Ensures text stays centered
                height: "50px", // Fixed height for better alignment
                "&:hover": {
                  backgroundColor: level === option ? "#d73a12" : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {option}
                </Typography>
              </CardContent>
            </Card>
            
            
            
            ))}
          </div>
          <br></br>

          <div className="block control">
            <TextField
              id="select-insurance-coverage-level"
              name="level"
              label="Level"
              variant="outlined"
              value={level}
              fullWidth
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
              required
            />
          </div>
          <p style={{ textAlign: "justify" }}></p>
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="control">
                  <Button
                    id="insurance-selection-submit"
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginTop: "16px" }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
            <div className="column has-text-right">
              <div
                className="subtitle is-4"
                id="insurance-selection-status-msg"
              >
                {/* Display status message here */}
              </div>
            </div>
          </div>
        </div>
      </form>
      <div>
        <Typography variant="h6" gutterBottom>
          Existing Insurance Selection Data
        </Typography>
        {/* <ul>
          {formData.map((data, index) => (
            // <li key={index}>
            <card>
              Coverage: {data.coverage},Level: {data.level}
            </card>
            // </li>
          ))}
        </ul> */}
        <card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Coverage</TableCell>
                  <TableCell>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{data.coverage}</TableCell>
                    <TableCell>{data.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </card>
      </div>
    </Container>
  );
}

export default InsuranceSelectionForm;
