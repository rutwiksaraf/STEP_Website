import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { fromZonedTime, format, toZonedTime } from "date-fns-tz";

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
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
  const [dateToday, setDateToday] = useState("");
  const [displayDate, setDisplayDate] = useState("");

  const token = localStorage.getItem("token");
  const [formValues, setFormValues] = useState({
    starter: "Fertilizer Application at Planting",
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
      isApplicationTypeConfirmed: 1,
    };

    console.log("Saving application type confirmation:", data);

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

  const productOptions = ["Pursell: 44.5-0-0", "Harrell: 42-0-0"];

  const handleproductClick = (selected) => {
    console.log("Selected product:", selected);
    setProductType(selected);
    if (selectedCard1 === selected) {
      setSelectedCard1(null);
    } else setSelectedCard1(selected);
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

    const now = new Date(); // current UTC time
    const timeZone = "America/Chicago";
    const localDateString = format(now, "yyyy-MM-dd", { timeZone }); // '2025-05-26'
    const chicagoMidnight = fromZonedTime(
      `${localDateString}T00:00:00`,
      timeZone
    );
    const utcDateToday = chicagoMidnight.toISOString(); // will now be 05:00:00Z
    setDateToday(utcDateToday);
  }, []); // Fetch data whenever applicationType changes

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
    const newValue = "Fertilizer Application at Planting"; // Placeholder for new value
    setFormValues((prevValues) => ({
      ...prevValues,
      starter: newValue,
    }));
  };

  const isStarterSelected = starterTableData.length > 0;

  const usHolidays = [
    "2025-01-01", // New Year's Day
    "2025-07-04", // Independence Day
    "2025-11-11", // Veterans Day
    "2025-12-25", // Christmas Day
  ];

  const getDynamicHolidays = (year) => {
    const holidays = [];

    // Martin Luther King Jr. Day (Third Monday of January)
    // const mlkDay = new Date(year, 0, 1);
    // while (mlkDay.getDay() !== 1) mlkDay.setDate(mlkDay.getDate() + 1);
    // mlkDay.setDate(mlkDay.getDate() + 14); // Third Monday
    // holidays.push(mlkDay.toISOString().split("T")[0]);

    // // Presidents' Day (Third Monday of February)
    // const presidentsDay = new Date(year, 1, 1);
    // while (presidentsDay.getDay() !== 1)
    //   presidentsDay.setDate(presidentsDay.getDate() + 1);
    // presidentsDay.setDate(presidentsDay.getDate() + 14);
    // holidays.push(presidentsDay.toISOString().split("T")[0]);

    // // Memorial Day (Last Monday of May)
    // const memorialDay = new Date(year, 4, 31);
    // while (memorialDay.getDay() !== 1)
    //   memorialDay.setDate(memorialDay.getDate() - 1);
    // holidays.push(memorialDay.toISOString().split("T")[0]);

    // // Labor Day (First Monday of September)
    // const laborDay = new Date(year, 8, 1);
    // while (laborDay.getDay() !== 1) laborDay.setDate(laborDay.getDate() + 1);
    // holidays.push(laborDay.toISOString().split("T")[0]);

    // // Thanksgiving (Fourth Thursday of November)
    // const thanksgiving = new Date(year, 10, 1);
    // while (thanksgiving.getDay() !== 4)
    //   thanksgiving.setDate(thanksgiving.getDate() + 1);
    // thanksgiving.setDate(thanksgiving.getDate() + 21);
    // holidays.push(thanksgiving.toISOString().split("T")[0]);

    return holidays;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay();
    const year = dateObj.getFullYear();

    const allHolidays = [...usHolidays, ...getDynamicHolidays(year)];

    if (dayOfWeek === 5 || dayOfWeek === 6) {
      setError(true);
      setErrorMessage("No Nitrogen inputs can be applied on weekends.");
      setDisplayDate(""); // Reset if invalid
      setDate(""); // Reset backend value too
    } else if (allHolidays.includes(selectedDate)) {
      setError(true);
      setErrorMessage("Selected date is a U.S. public holiday.");
      setDisplayDate("");
      setDate("");
    } else {
      setError(false);
      setErrorMessage("");

      const timeZone = "America/Chicago";
      const localMidnight = new Date(`${selectedDate}T00:00:00`);
      const utcDate = fromZonedTime(localMidnight, timeZone);

      setDisplayDate(selectedDate); // shown in textfield
      setDate(utcDate.toISOString()); // sent to backend
    }
  };

  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    const timeZone = "America/Chicago"; // Jay, FL
    const zoned = fromZonedTime(isoString, timeZone);
    return format(zoned, "yyyy-MM-dd");
  };

  console.log("Product Type:", productType);

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
          Enter the amount of nitrogen fertilizer (46-0-0) at the time of
          planning. Do not fill the form if no fertilizer is required at
          planting.”
        </p>

        <Typography variant="h6" color="text.secondary">
          Fertilizer Application at Planting
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
          disabled={isStarterSelected} // Disable if starter is selected
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isStarterSelected}
        >
          Submit (This cannot be changed once selected)
        </Button>
      </Box>
      <p></p>

      <Typography variant="h6" gutterBottom>
        Fertilizer Application at Planting
      </Typography>
      <TableContainer>
        <Table id={`table-n2-mgmnt-${sectionData}`} size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...starterTableData].map((app, index) => (
              <TableRow key={app.id}>
                <TableCell>{index + 1}</TableCell>
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

      <form onSubmit={handleAddApplication}>
        {/* <Typography variant="h6" gutterBottom>
          Add Application
        </Typography> */}

        {/* <div style={{ display: "flex", flexWrap: "wrap" }}>
                
                  <Card
                    key={option}
                    onClick={() =>
                      handleCardClick("in-season")
                    }
                    sx={{
                      cursor: "pointer",
                      margin: "4px",
                      padding: "10px 16px",
                      backgroundColor:
                        applicationType === "in-season" ? "#fa4616" : "#F5F5F5",
                      border:
                        selectedCard === option
                          ? "2px solid rgb(255, 255, 255)"
                          : "2px solid rgb(37, 106, 185)",
                      
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2">{option}</Typography>
                    </CardContent>
                  </Card>
                
              </div> */}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card
              onClick={() => {
                handleCardClick("in-season");
              }}
              sx={{
                cursor: "pointer",
                margin: "4px",
                padding: "10px 16px",
                backgroundColor:
                  applicationType === "in-season" ? "#fa4616" : "#F5F5F5",
                border:
                  applicationType === "in-season"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "8px",
                borderRadius: "12px",
                color: applicationType === "in-season" ? "white" : "#333",
                boxShadow:
                  applicationType === "in-season"
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
                    applicationType === "in-season" ? "#d73a12" : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="body2">
                  In-Season Fertilizer Application
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              onClick={() => {
                handleCardClick("controlled-release");
              }}
              sx={{
                cursor: "pointer",
                margin: "4px",
                padding: "10px 16px",
                backgroundColor:
                  applicationType === "controlled-release"
                    ? "#fa4616"
                    : "#F5F5F5",
                border:
                  applicationType === "controlled-release"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "8px",
                borderRadius: "12px",
                color:
                  applicationType === "controlled-release" ? "white" : "#333",
                boxShadow:
                  applicationType === "controlled-release"
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
                    applicationType === "controlled-release"
                      ? "#d73a12"
                      : "#E0E0E0",
                  transform: "scale(1.05)",
                },
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
        {/* <Button
        disabled={isApplicationTypeConfirmed}
          variant="contained"
          color="primary"
          onClick={}
        >
          Submit application type
        </Button> */}
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

        {applicationType === "in-season" && (
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
        {applicationType === "controlled-release" && (
          <>
            <p style={{ textAlign: "justify" }}>
              Controlled Release Fertilizer Program: You have the flexibility to
              choose any Controlled Release Fertilizer (CRF) blend at any rate.
              All the CRF applications will be applied at planting.
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
            <Grid item xs={12}>
              <Typography variant="h5">Controlled Release Product:</Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {productOptions.map((option) => (
                  <Card
                    key={option}
                    onClick={() => handleproductClick(option)}
                    sx={{
                      cursor: "pointer",
                      margin: "4px",
                      padding: "10px 16px",
                      backgroundColor:
                        productType === option ? "#fa4616" : "#F5F5F5",
                      border:
                        productType === option
                          ? "2px solid rgb(255, 255, 255)"
                          : "2px solid rgb(37, 106, 185)",
                      borderRadius: "12px",
                      color: productType === option ? "white" : "#333",
                      boxShadow:
                        productType === option
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
                          productType === option ? "#d73a12" : "#E0E0E0",
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
          </>
        )}
        <>
          <br></br>

          <TextField
            id={`${sectionData}-date-input`}
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            value={displayDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            error={error}
            helperText={error ? errorMessage : ""}
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
            onClick={() => handleConfirmApplicationType()}
            disabled={
              !applicationType || // applicationType is not selected
              !subapplicationType || // method not selected
              (applicationType === "controlled-release" && !productType)
            }
          >
            Add Application
          </Button>
        </>
      </form>
      <br></br>

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

                <TableCell>Placement</TableCell>

                <TableCell>Applied</TableCell>
                <TableCell>Source</TableCell>

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
                      <TableCell>{formatDateForDisplay(app.date)}</TableCell>
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
                      <TableCell>
                        {app.applicationType === "controlled-release"
                          ? app.product
                          : "Urea: 46-0-0"}
                      </TableCell>
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
    </Container>
  );
}

export default CottonNitrogenManagementForm;
