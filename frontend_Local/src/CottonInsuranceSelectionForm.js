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
} from "@mui/material";
import axios from "axios";

function CottonInsuranceSelectionForm() {
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
        "/api/cottongetInsuranceSelectionForms",
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
        .post("/api/cottoninsurancesubmit", formDataToSubmit, {
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Insurance Selection
        </Typography>
        <div style={{ display: "flex" }}>
          {/* Cards for selecting contract type */}
          <Card
            onClick={() => handleCardClick("Yield protection")}
            sx={{
              cursor: "pointer",
              margin: "4px",
              padding: "10px 16px",
              backgroundColor:
                coverage === "Yield protection" ? "#fa4616" : "#F5F5F5",
              border:
                coverage === "Yield protection"
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: coverage === "Yield  protection" ? "white" : "#333",
              boxShadow:
                coverage === "Yield protection"
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
                  coverage === "Yield protection" ? "#d73a12" : "#E0E0E0",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="body2">Yield protection</Typography>
            </CardContent>
          </Card>
          <Card
            onClick={() => handleCardClick("Revenue protection")}
            sx={{
              cursor: "pointer",
              margin: "4px",
              padding: "10px 16px",
              backgroundColor:
                coverage === "Revenue protection" ? "#fa4616" : "#F5F5F5",
              border:
                coverage === "Revenue protection"
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: coverage === "Revenue protection" ? "white" : "#333",
              boxShadow:
                coverage === "Revenue protection"
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
                  coverage === "Revenue protection" ? "#d73a12" : "#E0E0E0",
                transform: "scale(1.05)",
              }, // Highlight the selected card
            }}
          >
            <CardContent>
              <Typography variant="body2">Revenue protection</Typography>
            </CardContent>
          </Card>
        </div>
        <p style={{ textAlign: "justify" }}></p>
        <div className="field">
          <div className="block control">
            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="select-insurance-coverage">
                Coverage
              </InputLabel>
              <Select
                id="select-insurance-coverage"
                name="coverage"
                label="Coverage"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
              >
                <MenuItem value="">select insurance coverage</MenuItem>
                <MenuItem value="Yield protection">Yield protection</MenuItem>
                <MenuItem value="Revenue protection">
                  Revenue protection
                </MenuItem>
              </Select>
            </FormControl> */}
          </div>
          <br />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* Cards for selecting amount */}
            <Card
              sx={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor: "white",
                marginBottom: "8px",
                marginRight: "2px",
                textAlign: "center",
                fontWeight: "bold",
                //border: "2px solid #fa4616",
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
              backgroundColor:
                level === option ? "#fa4616" : "#F5F5F5",
              border:
                level === option
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: level === option ? "white" : "#333",
              boxShadow:
                level === option
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
                  level === option ? "#d73a12" : "#E0E0E0",
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
          <br></br>

          <div className="block control">
            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="select-insurance-coverage-level">
                Level
              </InputLabel>
              <Select
                id="select-insurance-coverage-level"
                name="level"
                label="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              >
                <MenuItem value="">Select Level</MenuItem>
                <MenuItem value="50%">50%</MenuItem>
                <MenuItem value="55%">55%</MenuItem>
                <MenuItem value="65%">65%</MenuItem>
                <MenuItem value="70%">70%</MenuItem>
                <MenuItem value="75%">75%</MenuItem>
                <MenuItem value="80%">80%</MenuItem>
                <MenuItem value="85%">85%</MenuItem>
              </Select>
            </FormControl> */}
            <p style={{ textAlign: "justify" }}></p>
          </div>
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
        {/* <ul>
          {formData.map((data, index) => (
            <li key={index}>
              Coverage: {data.coverage}, Level: {data.level}
            </li>
          ))}
        </ul> */}
      </div>
    </Container>
  );
}

export default CottonInsuranceSelectionForm;
