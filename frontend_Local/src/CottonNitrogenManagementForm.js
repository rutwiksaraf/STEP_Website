import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";

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
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import { useApplication } from "./ApplicationContext";

function CottonNitrogenManagementForm({ sectionData, hintText }) {
  //const [applicationType, setApplicationType] = useState("in-season");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCard1, setSelectedCard1] = useState(null);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [applications, setApplications] = useState([]);
  const teamName = localStorage.getItem("username");
  const [tableData, setTableData] = useState([]);
  const [starterTableData, setStarterTableData] = useState([]);
  const [subapplicationType, setSubApplicationType] = useState("");
  const [productType, setProductType] = useState("");
  const [dateToday, setDateToday] = useState(new Date().toISOString());
  const token = localStorage.getItem("token");
  const [formValues, setFormValues] = useState({
    starter: "Starter Fertilizer",
    amount: "",
  });

  const {
    applicationType,
    setApplicationType,
    isApplicationTypeConfirmed,
    setIsApplicationTypeConfirmed,
  } = useApplication();

  const handleApplicationTypeConfirmation = (event) => {
    setIsApplicationTypeConfirmed(event.target.checked);
  };

  const handleConfirmApplicationType = () => {
    setIsApplicationTypeConfirmed(true);
    saveApplicationTypeConfirmationToBackend();
  };

  const saveApplicationTypeConfirmationToBackend = () => {
    const data = {
      teamName: teamName,
      applicationType: applicationType,
      isConfirmed: true,
    };

    axios
      .post("/api/saveCottonApplicationTypeConfirmation", data, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("Application type confirmation saved:", response);
      })
      .catch((error) => {
        console.error("Error saving application type confirmation:", error);
      });
  };

  const handleCardClick = (value) => {
    setApplicationType(value);
  };

  const inseasonOptions = ["Broadcast", "Side-Dressed"];

  const controlledreleaseOptions = ["Broadcast", "Side-Dressed"];

  const productOptions = ["Pursell: 44.5-0-0", "Harrell: 43-0-0​"];

  const handleproductClick = (selected) => {
    // if (selected === "Harrell: 43-0-0​") setProductType("Harrell: 43-0-0​");
    // if (selected === "Pursell: 44.5-0-0") setProductType("Pursell: 44.5-0-0");
    setProductType(selected);
    // if (selectedCard1 === selected) {
    //   setSelectedCard1(null);
    // } else
    setSelectedCard1(selected);
  };

  const handleClick = (selected) => {
    if (selected === "Broadcast") setSubApplicationType("Broadcast");
    if (selected === "Banding") setSubApplicationType("banding");
    if (selected === "banding") setSubApplicationType("banding");
    if (selected === "Incorporated") setSubApplicationType("incorporated");
    if (selected === "Side-Dressed") setSubApplicationType("Side-Dressed");
    if (selected === "Liquidside-Dressing")
      setSubApplicationType("liquidside-dressing");
    if (selected === "Fertigation") setSubApplicationType("fertigation");
    if (selectedCard === selected) {
      setSelectedCard(null);
      setSubApplicationType("None");
    } else setSelectedCard(selected);
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchStarterDataFromBackend();
    fetchCottonApplicationTypeConfirmation();
    fetchDataFromBackend();
  }, [applicationType]); // Fetch data whenever applicationType changes

  const fetchCottonApplicationTypeConfirmation = () => {
    axios
      .get("/api/getCottonApplicationTypeConfirmation", {
        params: { teamName: teamName },

        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setApplicationType(response.data.applicationType);
          setIsApplicationTypeConfirmed(response.data.isConfirmed);
        } else {
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const handleDeleteApplication = (appId) => {
    axios
      .delete(`/api/deletecottonnitrogenApplication/${appId}`, {
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

  const fetchStarterDataFromBackend = () => {
    // Make an API request to fetch data from the backend based on the application type
    axios
      .get("/api/cottonfetchStarterData", {
        params: {
          teamName,
        },

        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          setStarterTableData(response.data);
          // console.log(response.data);
          console.log(starterTableData);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchDataFromBackend = () => {
    // Make an API request to fetch data from the backend based on the application type
    axios
      .get("/api/cottonfetchNitrogenManagementData", {
        params: {
          teamName,
          applicationType: applicationType,
        },

        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          setTableData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAddApplication = async (e) => {
    e.preventDefault();
    // Create a new application object
    let newApplication;

    // Customize the object for in-season type
    newApplication = {
      applicationType: applicationType,
      date: date,
      amount: amount,
      placement: subapplicationType, // Initialize as an empty array
      teamName,
      applied: "no",
      product: productType,
      dateToday: dateToday,
    };

    // Add the new application to the local state
    setApplications([...applications, newApplication]);

    // Clear the form fields
    setDate("");
    setAmount("");

    // Send the new application data to the backend
    sendApplicationDataToBackend(newApplication);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    // If there's some text, remove errors
  };

  // Function to send application data to the backend using Axios
  const sendApplicationDataToBackend = (applicationData) => {
    axios
      .post("/api/cottonnitrogenmanagementsubmit", applicationData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Application data sent to the backend successfully");
          fetchDataFromBackend();
        } else {
          console.error("Failed to send application data to the backend");
        }
      })
      .catch((error) => {
        console.error("Error sending application data:", error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Starter Form Data:", formValues);
    const fullFormValues = {
      ...formValues,
      teamName: teamName,
    };
    console.log("Starter Form Data:", fullFormValues);
    // Backend submission logic here
    try {
      const response = await axios
        .post("/api/cottonnitrogenstarter", fullFormValues, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        })
        .then((response) => {
          console.log("Response:", response.data);
          // Handle response or clear form, navigate, show message etc.
          if (response.status === 200) {
            console.log("Application data sent to the backend successfully");
            fetchStarterDataFromBackend();
          } else {
            console.error("Failed to send application data to the backend");
          }
          setFormValues({ starter: "", amount: "" }); // Clear the form
        });
    } catch (error) {
      console.error("Error submitting starter form:", error);
      alert("Failed to submit fertilizer data.");
    }
  };

  const handleCardClick2 = () => {
    // Example: Toggle a specific value or open a dialog to change the value
    const newValue = "Starter Fertilizer"; // Placeholder for new value
    setFormValues((prevValues) => ({
      ...prevValues,
      starter: newValue,
    }));
  };

  return (
    <Container>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ mt: 4 }}
      >
        <Typography variant="h6">Fertilizer Application Form</Typography>
        <p>
          All the starter fertilizer is applied at planting, Source 46-0-0. Do
          not fill the form if no starter fertilizer is required.
        </p>
        {/* <TextField
          fullWidth
          label="Starter Fertilizer"
          variant="outlined"
          name="starter"
          value={formValues.starter}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        /> */}

        <Typography variant="h6" color="text.secondary">
          Starter Fertilizer
        </Typography>
        {/* <Typography variant="body1">
              {formValues.starter || "No starter fertilizer selected"}
            </Typography> */}

        <p></p>
        <TextField
          fullWidth
          label="Amount (Pound/Acre of Nitrogen)"
          variant="outlined"
          name="amount"
          value={formValues.amount}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
      <p></p>

      <form onSubmit={handleAddApplication}>
        {/* <Typography variant="h6" gutterBottom>
          Add Application
        </Typography> */}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card
              onClick={() =>
                !isApplicationTypeConfirmed && handleCardClick("in-season")
              }
              sx={{
                cursor: !isApplicationTypeConfirmed ? "pointer" : "not-allowed",
                padding: "8px",
                backgroundColor:
                  applicationType === "in-season" ? "#fa4616" : "#F5F5F5",
                border: "2px solid #fa4616",
                borderRadius: "8px",
                opacity:
                  isApplicationTypeConfirmed && applicationType !== "in-season"
                    ? 0.5
                    : 1,
              }}
            >
              <CardContent>
                <Typography variant="body2">
                  In-season Fertilizer Application
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              onClick={() =>
                !isApplicationTypeConfirmed &&
                handleCardClick("controlled-release")
              }
              sx={{
                cursor: !isApplicationTypeConfirmed ? "pointer" : "not-allowed",
                padding: "8px",
                backgroundColor:
                  applicationType === "controlled-release"
                    ? "#fa4616" : "#F5F5F5",

                border: "2px solid #fa4616",
                borderRadius: "8px",
                opacity:
                  isApplicationTypeConfirmed &&
                  applicationType !== "controlled-release"
                    ? 0.5
                    : 1,
              }}
            >
              <CardContent>
                <Typography variant="body2">
                  Controlled-Release Fertilizer
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br></br>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleConfirmApplicationType()}
          disabled={isApplicationTypeConfirmed} // Button is disabled if the application type is confirmed
        >
          Submit application type (cannot be changed later)
        </Button>
        <br></br>
        <br></br>
        {/* <FormControlLabel
          control={
            <Checkbox
              checked={isApplicationTypeConfirmed}
              onChange={(event) => {
                handleApplicationTypeConfirmation(event);
                if (event.target.checked) {
                  handleConfirmApplicationType();
                }
              }}
            />
          }
          label="Confirm application type by ticking the checkbox (application type cannot be changed later once check box is ticked)"
        /> */}

        {/* <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="applicationType"
              name="applicationType"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
            >
              <FormControlLabel
                value="in-season"
                control={<Radio />}
                label="In-season Fertilizer Application"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="applicationType"
              name="applicationType"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value)}
            >
              <FormControlLabel
                value="controlled-release"
                control={<Radio />}
                label="Controlled-Release Fertilizer"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid> */}

        {isApplicationTypeConfirmed && applicationType === "in-season" && (
          <>
            <p style={{ textAlign: "justify" }}>
              In-season fertilizer applications of granular urea (46-0-0) is
              allowed. There will be no limit on the nitrogen rate, and you can
              choose the application timing using Broadcasting or Banding.
            </p>

            <p style={{ textAlign: "justify" }}>
              In case of a leaching rain event (determined by the project
              management team), an additional application of Nitrogen at 30
              Pounds/Acre will be allowed. Participating teams will be
              responsible to communicate their decision at least three days in
              advance.
            </p>

            <Grid item xs={12}>
              <Typography variant="h5">
                In season application methods:
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {inseasonOptions.map((option) => (
                  <Card
                    key={option}
                    onClick={() => handleClick(option)}
                    sx={{
                      cursor: "pointer",
                      margin: "4px",
                      padding: "10px 16px",
                      backgroundColor:
                        selectedCard === option ? "#fa4616" : "#F5F5F5",
                      border:
                        selectedCard === option
                          ? "2px solid rgb(255, 255, 255)"
                          : "2px solid rgb(37, 106, 185)",
                      borderRadius: "12px",
                      color: selectedCard === option ? "white" : "#333",
                      boxShadow:
                        selectedCard === option
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
                          selectedCard === option ? "#d73a12" : "#E0E0E0",
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
            <br></br>
            {/* <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="subapplicationtype-label">
                  Application Type
                </InputLabel>
                <Select
                  labelId="subapplicationtype-label"
                  id="subapplicationtype"
                  label="Application Type"
                  value={subapplicationType}
                  onChange={(e) => setSubApplicationType(e.target.value)}
                  required
                >
                  <MenuItem value="">Select Application</MenuItem>
                  <MenuItem value="Broadcast">Broadcast</MenuItem>
                  <MenuItem value="banding">Banding</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
          </>
        )}
        {isApplicationTypeConfirmed &&
          applicationType === "controlled-release" && (
            <>
              <p style={{ textAlign: "justify" }}>
                Controlled Release Fertilizer Program: You have the flexibility
                to choose any Controlled Release Fertilizer (CRF) blend at any
                rate. All the CRF applications will be applied at planting.
              </p>

              <p style={{ textAlign: "justify" }}>
                In case of a leaching rain event (determined by the project
                management team), an additional application of Nitrogen at 30
                Pounds/Acre will be allowed. Participating teams will be
                responsible to communicate their decision at least three days in
                advance.
              </p>
              <Grid item xs={12}>
                <Typography variant="h5">
                  Controlled Release application methods:
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {controlledreleaseOptions.map((option) => (
                    <Card
                      key={option}
                      onClick={() => handleClick(option)}
                      sx={{
                        cursor: "pointer",
                        margin: "4px",
                        padding: "8px",
                        backgroundColor:
                          selectedCard === option ? "#fa4616" : "#D8D4D7",
                        border: "2px solid #fa4616",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2">{option}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Grid>
              <br></br>
              <Grid item xs={12}>
                <Typography variant="h5">
                  Controlled Release Product:
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {productOptions.map((option) => (
                    <Card
                      key={option}
                      onClick={() => handleproductClick(option)}
                      sx={{
                        cursor: "pointer",
                        margin: "4px",
                        padding: "8px",
                        backgroundColor:
                          selectedCard1 === option ? "#fa4616" : "#D8D4D7",
                        border: "2px solid #fa4616",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body2">{option}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Grid>
              <br></br>
            </>
          )}
        {isApplicationTypeConfirmed && (
          <>
            <br></br>

            <TextField
              id={`${sectionData}-date-input`}
              label="Date"
              variant="outlined"
              fullWidth
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">mm/dd/yy</InputAdornment>
              //   ),
              // }}
            />
            <br></br>
            <br></br>
            <TextField
              id={`${sectionData}-amount-input`}
              label="Amount (Pound/Acre of Nitrogen)"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              helperText={hintText}
              required
            />
            <br></br>
            <br></br>
            <Button
              id={`n2-mgmnt-${sectionData}-add`}
              variant="contained"
              color="primary"
              type="submit"
            >
              Add Application
            </Button>
          </>
        )}
      </form>
      <br></br>
      <Typography variant="h6" gutterBottom>
        Starter Fertilizer Data
      </Typography>
      <TableContainer>
        <Table id={`table-n2-mgmnt-${sectionData}`} size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Starter</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...starterTableData].map((app, index) => (
              <TableRow key={app.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{app.starter}</TableCell>
                <TableCell>{app.amount}</TableCell>
                {/* Optionally render additional cell based on condition */}
                {/* {applicationType === "in-season" && (
                        <TableCell>{app.placement}</TableCell>
                    )} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isApplicationTypeConfirmed && (
        <>
          <br></br>
          <Typography variant="h6" gutterBottom>
            Application Data
          </Typography>
          <br></br>
          <TableContainer>
            <Table id={`table-n2-mgmnt-${sectionData}`} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>

                  <TableCell>placement</TableCell>
                  <TableCell>Applied</TableCell>
                  {applicationType === "controlled-release" && (
                    <TableCell>Product</TableCell>
                  )}
                  <TableCell>
                    <EditIcon />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...tableData]
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((app, index) => {
                    // Format the date to display only the date part (YYYY-MM-DD)
                    //const formattedDate = new Date(app.date.substring(0, 10)).toLocaleDateString();
                    return (
                      <TableRow key={app.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{app.date.substring(0, 10)}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>{app.placement}</TableCell>
                        <TableCell>
                          <button
                            style={{
                              backgroundColor:
                                app.applied === "no" ? "red" : "green",
                              color: "white", // Assuming you want white text for contrast
                              border: "none", // Remove default button border styling
                              // Add any other styling you need here
                            }}
                          >
                            {app.applied === "no" ? (
                              <HighlightOffIcon />
                            ) : (
                              <DoneIcon />
                            )}
                          </button>
                        </TableCell>
                        {applicationType === "controlled-release" && (
                          <TableCell>{app.product}</TableCell>
                        )}
                        <TableCell>
                          <button>
                            {app.applied === "no" ? (
                              <DeleteIcon
                                onClick={() => handleDeleteApplication(app.id)}
                              />
                            ) : (
                              <EditOffIcon />
                            )}
                          </button>
                        </TableCell>

                        {/*  {applicationType === "in-season" && (
                  <TableCell>{app.placement}</TableCell> 
                )}*/}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
  //               return (
  //                 <TableRow key={app.id}>
  //                   <TableCell>{index + 1}</TableCell>
  //                   <TableCell>{app.date.substring(0, 10)}</TableCell>
  //                   <TableCell>{app.amount}</TableCell>
  //                   <TableCell>{app.placement}</TableCell>
  //                   <TableCell>
  //                     {app.applied === "no" ? (
  //                       <HighlightOffIcon />
  //                     ) : (
  //                       <DoneIcon />
  //                     )}
  //                   </TableCell>
  //                   <TableCell>
  //                     {" "}
  //                     <button>
  //                       {app.applied === "no" ? (
  //                         <DeleteIcon
  //                           onClick={() => handleDeleteApplication(app.id)}
  //                         />
  //                       ) : (
  //                         <EditOffIcon />
  //                       )}
  //                     </button>
  //                   </TableCell>
  //                   {/* {applicationType === "in-season" && (
  //                 <TableCell>{app.placement}</TableCell>
  //               )} */}
  //                 </TableRow>
  //               );
  //             })}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </Container>
  // );
}

export default CottonNitrogenManagementForm;
