import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import axios from "axios"; // Import Axios
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";

function MarketingOptionsForm() {
  const [contractType, setContractType] = useState("");
  const [quantityBushels, setQuantityBushels] = useState("");
  const [marketingOptions, setMarketingOptions] = useState([]);
  const [dateToday, setDateToday] = useState(new Date().toISOString());
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Function to handle card click and update the selected contract type
  const handleCardClick = (value) => {
    setContractType(value);
  };

  const bushels = [
    "20k",
    "30k",
    "40k",
    "50k",
    "60k",
    "70k",
    "80k",
    "90k",
    "100k",
    "110k",
    "120k",
    "130k",
    "140k",
    "150k",
    "160k",
    "170k",
    "180k",
    "190k",
    "200k",
  ];

  const handleDeleteMarketingApplication = (appId) => {
    axios
      .delete(`/api/deletemarketingApplication/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          fetchDataFromBackend();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  const handleMarketingChangeApplied = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateCompleted/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchDataFromBackend();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  const handleQuantityCardClick = (selectedLevel) => {
    if (selectedLevel == quantityBushels) setQuantityBushels("None");
    else setQuantityBushels(selectedLevel);
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchDataFromBackend();
  }, []);

  const handleAddOption = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent
    const newOption = {
      date: dateToday,
      contractType,
      quantityBushels,
      teamName,
      //complete: "no",
      complete: contractType === "Flat-price" ? "yes" : "no",
    };

    // Send a POST request to your backend endpoint to insert the new option
    axios
      .post("/api/insertMarketingOption", newOption, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        // Handle the successful response if needed
        if (response.status === 200) {
          console.log("Application data sent to the backend successfully");
          fetchDataFromBackend();
        } else {
          console.error("Failed to send application data to the backend");
        }

        // Clear the form fields
        setContractType("");
        setQuantityBushels("");

        // Fetch the updated data from the backend
      })
      .catch((error) => {
        // Handle errors
        console.error("Error adding option:", error);
      });
  };

  const fetchDataFromBackend = () => {
    // Make an API request to fetch data from the backend
    axios
      .get("/api/fetchMarketingOptions", {
        params: {
          teamName, // Replace with the actual team name
        },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          setMarketingOptions(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="100%">
      <Typography variant="h6" gutterBottom>
        Marketing Options
      </Typography>
      <form onSubmit={handleAddOption}>
        <div className="field">
          <div className="control">
            <div style={{ display: "flex" }}>
              {/* Cards for selecting contract type */}
              <Card
                onClick={() => handleCardClick("Flat-price")}
                sx={{
                  cursor: "pointer",
                  margin: "4px",
                  padding: "10px 16px",
                  backgroundColor:
                    contractType === "Flat-price" ? "#fa4616" : "#F5F5F5",
                  border:
                    contractType === "Flat-price"
                      ? "2px solid rgb(255, 255, 255)"
                      : "2px solid rgb(37, 106, 185)",
                  borderRadius: "12px",
                  color: contractType === "Flat-price" ? "white" : "#333",
                  boxShadow:
                    contractType === "Flat-price"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                      : "none",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  height: "50px",
                  "&:hover": {
                    backgroundColor:
                      contractType === "Flat-price" ? "#d73a12" : "#E0E0E0",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Flat-price Contract
                  </Typography>
                </CardContent>
              </Card>

              <Card
                onClick={() => handleCardClick("Basis")}
                sx={{
                  cursor: "pointer",
                  margin: "4px",
                  padding: "10px 16px",
                  backgroundColor:
                    contractType === "Basis" ? "#fa4616" : "#F5F5F5",
                  border:
                    contractType === "Basis"
                      ? "2px solid rgb(255, 255, 255)"
                      : "2px solid rgb(37, 106, 185)",
                  borderRadius: "12px",
                  color: contractType === "Basis" ? "white" : "#333",
                  boxShadow:
                    contractType === "Basis"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                      : "none",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  height: "50px",
                  "&:hover": {
                    backgroundColor:
                      contractType === "Basis" ? "#d73a12" : "#E0E0E0",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Basis Contract
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <p style={{ textAlign: "justify" }}></p>

            <InputLabel htmlFor="select-contract-type">
              Contract Type
            </InputLabel>
            <TextField
              id="select-contract-type"
              name="contract-type"
              label="Contract Type"
              value={contractType}
              variant="outlined"
              fullWidth
              onChange={(e) => setContractType(e.target.value)}
              placeholder="Hybrid"
              required
            />
          </div>
          <br></br>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            {/* Quantity Heading */}
            <Typography
              variant="subtitle1"
              sx={{ marginBottom: "8px" }}
            >
              Quantity
            </Typography>

            {/* Container for Quantity Options */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "start",
                
              }}
            >
              {bushels.map((option) => (
                <Card
                  key={option}
                  onClick={() => handleQuantityCardClick(option)}
                  sx={{
                    cursor: "pointer",
                    margin: "4px",
                    padding: "10px 16px",
                    backgroundColor:
                      quantityBushels === option ? "#fa4616" : "#F5F5F5",
                    border:
                      quantityBushels === option
                        ? "2px solid rgb(255, 255, 255)"
                        : "2px solid rgb(37, 106, 185)",
                    borderRadius: "12px",
                    color: quantityBushels === option ? "white" : "#333",
                    boxShadow:
                      quantityBushels === option
                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                        : "none",
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "50px",
                    width: "70px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor:
                        quantityBushels === option ? "#d73a12" : "#E0E0E0",
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
          </div>

          <br></br>

          <div className="control">
            <InputLabel htmlFor="select-quantity-bushels">
              Quantity Bushels
            </InputLabel>
            <TextField
              id="select-quantity-bushels"
              name="quantity-bushels"
              label="Quantity Bushels"
              value={quantityBushels}
              variant="outlined"
              fullWidth
              onChange={(e) => setQuantityBushels(e.target.value)}
              placeholder="Quantity Bushels"
              required
            />
          </div>
        </div>
        <br></br>
        <div className="field">
          <div className="control">
            <Button
              id="marketing-option-add"
              variant="outlined"
              color="primary"
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Add Option
            </Button>
          </div>
        </div>
      </form>
      <div className="table-container">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Date (EST)</TableCell>
                <TableCell>Contract Type</TableCell>
                <TableCell>Quantity Bushels</TableCell>
                <TableCell>
                  Status (Press 'x' to change status to Complete)
                </TableCell>
                <TableCell>Completion date</TableCell>
                {/* <TableCell>
                  <EditIcon />
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {marketingOptions.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{option.date}</TableCell>
                  <TableCell>{option.contractType}</TableCell>
                  <TableCell>{option.quantityBushels}</TableCell>
                  {/* <TableCell>{option.complete}</TableCell> */}
                  <TableCell>
                    <button
                      style={{
                        backgroundColor:
                          option.complete === "no" ? "red" : "green",
                        color: "white", // Assuming you want white text for contrast
                        border: "none", // Remove default button border styling
                        // Add any other styling you need here
                      }}
                    >
                      {option.complete === "no" ? (
                        <HighlightOffIcon
                          onClick={() =>
                            handleMarketingChangeApplied(option.id)
                          }
                        />
                      ) : (
                        <DoneIcon />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    {option.complete === "yes" ? (
                      <p style={{ textAlign: "justify" }}>
                        {option.completedon}
                      </p>
                    ) : (
                      <></>
                    )}
                  </TableCell>

                  {/* <TableCell>
                    <button>
                      {option.complete === "no" ? (
                        <DeleteIcon
                          onClick={() =>
                            handleDeleteMarketingApplication(option.id)
                          }
                        />
                      ) : (
                        <EditOffIcon />
                      )}
                    </button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default MarketingOptionsForm;
