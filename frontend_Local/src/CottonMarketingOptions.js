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
} from "@mui/material";
import axios from "axios"; // Import Axios
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";

function CottonMarketingOptionsForm() {
  const [contractType, setContractType] = useState("Flat-price");
  const [quantityBushels, setQuantityBushels] = useState("");
  const [marketingOptions, setMarketingOptions] = useState([]);
  const [dateToday, setDateToday] = useState(new Date().toISOString());
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const handleCardClick = (value) => {
    setContractType(value);
  };

  const handleMarketingChangeApplied = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/cottonupdateCompleted/${appId}`,
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

  const bushels = [
    "200",
    "400",
    "600",
    "800",
    "1000",
    "1200",
    "1400",
    "1600",
    "1800",
    "2000",
    "2200",
    "2400",
  ];

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
      complete: contractType === "Flat-price" ? "yes" : "no",
    };

    // Send a POST request to your backend endpoint to insert the new option
    axios
      .post("/api/cottoninsertMarketingOption", newOption, {
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
      .get("/api/cottonfetchMarketingOptions", {
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
    <Container>
      <Typography variant="h6" gutterBottom>
        Marketing Contracts
      </Typography>
      <form onSubmit={handleAddOption}>
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
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically
              textAlign: "center", // Ensures text stays centered
              height: "50px", // Fixed height for better alignment
              "&:hover": {
                backgroundColor:
                  contractType === "Flat-price" ? "#d73a12" : "#E0E0E0",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <Typography variant="body2">Forward Contract</Typography>
            </CardContent>
          </Card>
          {/* <Card
            onClick={() => handleCardClick("Basis")}
            sx={{
              cursor: "pointer",
              padding: "10px",
              backgroundColor: contractType === "Basis" ? "#fa4616" : "#D8D4D7", // Highlight the selected card
              border: "2px solid #fa4616",
            }}
          >
            <CardContent>
              <Typography variant="body2">Basis Contract</Typography>
            </CardContent>
          </Card> */}
        </div>
        <p style={{ textAlign: "justify" }}></p>

        <div className="field">
          <div className="control">
            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="select-contract-type">
                Contract Type
              </InputLabel>
              <Select
                id="select-contract-type"
                name="contract-type"
                label="Contract Type"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                required
              >
                <MenuItem value="">select-contract-type</MenuItem>
                <MenuItem value="Flat-price">Flat-price</MenuItem>
                <MenuItem value="Basis">Basis</MenuItem>
              </Select>
            </FormControl> */}
          </div>
          <br></br>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {/* Cards for selecting amount */}
            <Card
              sx={{
                cursor: "pointer",
                padding: "8px",
                backgroundColor: "#F5F5F5",
                marginBottom: "8px",
                marginRight: "2px",
                textAlign: "center",
                fontWeight: "bold",
                border: "2px solid rgb(255, 255, 255)",
              }}
            >
              <CardContent>
                <Typography variant="body2">Quantity</Typography>
              </CardContent>
            </Card>

            {bushels?.map((option) => (
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
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                  textAlign: "center", // Ensures text stays centered
                  height: "50px", // Fixed height for better alignment
                  "&:hover": {
                    backgroundColor:
                      quantityBushels === option ? "#d73a12" : "#E0E0E0",
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
          <div className="control">
            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="select-quantity-bushels">
                Quantity Bushels
              </InputLabel>
              <Select
                id="select-quantity-bushels"
                name="quantity-bushels"
                label="Quantity Bushels"
                value={quantityBushels}
                onChange={(e) => setQuantityBushels(e.target.value)}
                required
              >
                <MenuItem value="">select quantity bushels</MenuItem>
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="300">300</MenuItem>
                <MenuItem value="400">400</MenuItem>
                <MenuItem value="500">500</MenuItem>
                <MenuItem value="600">600</MenuItem>
                <MenuItem value="700">700</MenuItem>
                <MenuItem value="800">800</MenuItem>
                <MenuItem value="900">900</MenuItem>
                <MenuItem value="1000">1000</MenuItem>
              </Select>
            </FormControl> */}
          </div>
        </div>
        <br></br>
        <div className="field">
          <div className="control">
            <Button
              id="marketing-option-add"
              variant="contained"
                    color="primary"
              type="submit"
              style={{ marginTop: "16px" }}
              disabled={
                !contractType === "" || quantityBushels === ""
              }
            >
              Submit
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
                <TableCell>Quantity Bales</TableCell>
                {/* <TableCell>
                  Status (Press 'x' to change status to Complete)
                </TableCell>
                <TableCell>Completion date</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {marketingOptions?.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{option.date.slice(0, 10)}</TableCell>
                  <TableCell>{option.contractType}</TableCell>
                  <TableCell>{option.quantityBushels}</TableCell>
                  {/* <TableCell>{option.complete}</TableCell> */}
                  {/* <TableCell>
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

export default CottonMarketingOptionsForm;
