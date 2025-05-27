import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Radio,
  FormControlLabel,
  RadioGroup,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios"; // Import Axios
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import { useApplication } from "./IrrigationContext";
import { useApplication1 } from "./SensorContext";
import { toZonedTime } from "date-fns-tz";


function IrrigationManagementForm() {
  //const [soilMoistureSensor, setSoilMoistureSensor] = useState("");
  const [sectionData, setSectionData] = useState("v10-harvest");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [applications, setApplications] = useState([]);
  const teamName = localStorage.getItem("username");
  const sensorOptions = ["BMP logic", "AquaSpy"];
  //const [selectedOption, setSelectedOption] = useState("null");
  
  const [displayDate, setDisplayDate] = useState(""); // for date input field

  const getTodayESTAsUTC = () => {
    const timeZone = "America/New_York";
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const localMidnight = new Date(year, month, day, 0, 0, 0); // midnight EST
    const zoned = toZonedTime(localMidnight, timeZone);
    return new Date(zoned).toISOString(); // converted to UTC ISO string
  };
  
  const [dateToday, setDateToday] = useState(getTodayESTAsUTC());

  const token = localStorage.getItem("token");

  //const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =useState(false);

  const handleApplicationTypeConfirmation = (event) => {
    setIsApplicationTypeConfirmed(event.target.checked);
  };

  const handleApplicationTypeConfirmation1 = (event) => {
    setIsApplicationTypeConfirmed1(event.target.checked);
  };

  const {
    selectedOption,
    setSelectedOption,
    isApplicationTypeConfirmed,
    setIsApplicationTypeConfirmed,
  } = useApplication();

  const {
    soilMoistureSensor,
    setSoilMoistureSensor,
    isApplicationTypeConfirmed1,
    setIsApplicationTypeConfirmed1,
  } = useApplication1();

  const handleConfirmApplicationType = () => {
    setIsApplicationTypeConfirmed(true);
    saveApplicationTypeConfirmationToBackend();
  };

  const handleConfirmApplicationType1 = () => {
    setIsApplicationTypeConfirmed1(true);
    saveApplicationTypeConfirmationToBackend1();
  };

  const saveApplicationTypeConfirmationToBackend = () => {
    const data = {
      teamName: teamName,
      applicationType: selectedOption,
      isConfirmed: true,
    };

    axios
      .post("/api/saveIrrigationApplicationTypeConfirmation", data, {
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

  const saveApplicationTypeConfirmationToBackend1 = () => {
    const data = {
      teamName: teamName,
      applicationType: soilMoistureSensor,
      isConfirmed: true,
    };

    axios
      .post("/api/saveMoistureApplicationTypeConfirmation", data, {
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

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchApplicationTypeConfirmation();
    fetchApplicationTypeConfirmation1();
    fetchData();
  }, []); // Fetch data whenever applicationType changes

  const fetchApplicationTypeConfirmation = () => {
    axios
      .get("/api/getIrrigationApplicationTypeConfirmation", {
        params: { teamName: teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setSelectedOption(response.data.applicationType);
          setIsApplicationTypeConfirmed(response.data.isConfirmed);
        } else {
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmation1 = () => {
    axios
      .get("/api/getMoistureApplicationTypeConfirmation", {
        params: { teamName: teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setSoilMoistureSensor(response.data.applicationType);
          setIsApplicationTypeConfirmed1(response.data.isConfirmed);
        } else {
          console.error("Sensor type confirmation not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching sensor type confirmation:", error);
      });
  };

  const amountOptions = [
    "0.05",
    "0.10",
    "0.15",
    "0.20",
    "0.25",
    "0.30",
    "0.35",
    "0.40",
    "0.45",
    "0.50",
  ];

  const handleAmountCardClick = (selectedAmount) => {
    setAmount(selectedAmount);
  };

  const handleCardClick = (value) => {
    setSelectedOption(value);
  };

  const handleDeleteApplication = (appId) => {
    axios
      .delete(`/api/deleteirrigationApplication/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          fetchData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  const fetchData = () => {
    axios
      .get("/api/fetchSoilMoistureSensorData", {
        params: {
          teamName, // Replace with the actual team name
        },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        // Handle the successful response and update the state
        setApplications(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  };

  // Call the fetchData function when the component mounts

  const handleAddApplication = () => {
    // Add the application to the applications array
    const newApplication = {
      date: date,
      amount: amount,
    };
    setApplications([...applications, newApplication]);

    // Clear the form fields
    setDate("");
    setAmount("");
  };

  // Function to send form data to the backend
  const submitForm = async (e) => {
    e.preventDefault();
    if (selectedOption === "") {
      // Display an error message or prevent form submission
      alert("Please select an Irrigation Management option.");
      return;
    }
    // Prepare the data to be sent
    let formData;
    if (selectedOption === "soil-moisture") {
      if (soilMoistureSensor === "") {
        // Display an error message or prevent form submission
        alert("Please select a sensor.");
        return;
      }
      formData = {
        date: date,
        reading: amount,
        options: selectedOption,
        applied: "no",
        teamName, // Get team name from session
        sensorType: soilMoistureSensor, // Send sensor type
        dateToday: dateToday,
      };
    } else if (selectedOption === "calendar") {
      formData = {
        date: date,
        reading: amount,
        options: selectedOption,
        applied: "no",
        teamName, // Get team name from session
        sensorType: "", // Send sensor type
        dateToday: dateToday,
      };
    } else if (selectedOption === "evapotranspiration") {
      formData = {
        date: date,
        reading: amount,
        options: selectedOption,
        applied: "no",
        teamName, // Get team name from session
        sensorType: "", // Send sensor type
        dateToday: dateToday,
      };
    }

    // Send a POST request to your backend endpoint
    axios
      .post("/api/soilmoisturesensorsubmit", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        // Handle the successful response if needed
        if (response.status === 200) {
          console.log("Application data sent to the backend successfully");
          setAmount("");
          setDate("");
          fetchData();
        } else {
          console.error("Failed to send application data to the backend");
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error submitting form:", error);
      });
  };

  const handleSensorCardClick = (selectedSensor) => {
    // Handle card click event to select the sensor
    //if (!soilMoistureSensor)
    setSoilMoistureSensor(selectedSensor);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const usHolidays = [
    "2025-01-01", // New Year's Day
    "2025-07-04", // Independence Day
    "2025-11-11", // Veterans Day
    "2025-12-25", // Christmas Day
  ];

  const getDynamicHolidays = (year) => {
    const holidays = [];

    // // Martin Luther King Jr. Day (Third Monday of January)
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
    setErrorMessage("No Irrigation inputs can be applied on weekends.");
  } else if (allHolidays.includes(selectedDate)) {
    setError(true);
    setErrorMessage(
      "Selected date is a U.S. public holiday. No Irrigation inputs can be applied on public holidays."
    );
  } else {
    setError(false);
    setErrorMessage("");

    setDisplayDate(selectedDate); // ✅ bind to input field
    setDate(getUtcFromLocalESTDate(selectedDate)); // ✅ store as UTC for backend
  }
};

const getUtcFromLocalESTDate = (dateStr) => {
  const timeZone = "America/New_York";
  const localMidnight = new Date(`${dateStr}T00:00:00`);
  const utcDate = new Date(localMidnight.toLocaleString("en-US", { timeZone }));
  return utcDate.toISOString();
};



  return (
    <Container maxWidth="100%">
      <form onSubmit={submitForm}>
        <Grid item xs={12}>
          <h4>You have three options for irrigation management:</h4>
          <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
            <Card
              onClick={() => handleCardClick("soil-moisture")}
              sx={{
                width: "30%",
                minWidth: "200px",
                cursor: "pointer",
                margin: "5px",
                padding: "10px 16px",
                backgroundColor:
                  selectedOption === "soil-moisture" ? "#fa4616" : "#F5F5F5",
                border:
                  selectedOption === "soil-moisture"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "12px",
                color: selectedOption === "soil-moisture" ? "white" : "#333",
                boxShadow:
                  selectedOption === "soil-moisture"
                    ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                    : "none",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "60px",
                "&:hover": {
                  backgroundColor:
                    selectedOption === "soil-moisture" ? "#d73a12" : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Soil Moisture-Based
                </Typography>
              </CardContent>
            </Card>
            <Card
              onClick={() => handleCardClick("evapotranspiration")}
              sx={{
                width: "30%",
                minWidth: "200px",
                cursor: "pointer",
                margin: "5px",
                padding: "10px 16px",
                backgroundColor:
                  selectedOption === "evapotranspiration"
                    ? "#fa4616"
                    : "#F5F5F5",
                border:
                  selectedOption === "evapotranspiration"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "12px",
                color:
                  selectedOption === "evapotranspiration" ? "white" : "#333",
                boxShadow:
                  selectedOption === "evapotranspiration"
                    ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                    : "none",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "60px",
                "&:hover": {
                  backgroundColor:
                    selectedOption === "evapotranspiration"
                      ? "#d73a12"
                      : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Evapotranspiration Based
                </Typography>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleCardClick("calendar")}
              sx={{
                width: "30%",
                minWidth: "200px",
                cursor: "pointer",
                margin: "5px",
                padding: "10px 16px",
                backgroundColor:
                  selectedOption === "calendar" ? "#fa4616" : "#F5F5F5",
                border:
                  selectedOption === "calendar"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
                borderRadius: "12px",
                color: selectedOption === "calendar" ? "white" : "#333",
                boxShadow:
                  selectedOption === "calendar"
                    ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                    : "none",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "60px",
                "&:hover": {
                  backgroundColor:
                    selectedOption === "calendar" ? "#d73a12" : "#E0E0E0",
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Calendar-Based
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Grid>
        <br></br>
        {!isApplicationTypeConfirmed && (
          <FormControlLabel
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
            label="Confirm Irrigation management option by ticking the checkbox (this cannot be changed later once check box is ticked)"
          />
        )}
        {selectedOption === "soil-moisture" && (
          <>
            <Container component="main">
              <p style={{ textAlign: "justify" }}>
                One soil moisture probe will be installed per-team for soil
                moisture monitoring. Teams will be responsible to communicate
                the type of soil moisture sensor to be installed in their plot
                at the time of planting.
              </p>
              {/* <ul>
                  <li>Sentek probe (Holder Ag)</li>
                  <li>BMP logic</li>
                  <li>AquaSpy</li>
                </ul> */}
              <p style={{ textAlign: "justify" }}>
                You will have access to soil moisture data on the respective
                company's website.
              </p>
              <ul>
                <li>
                  <p style={{ textAlign: "justify" }}>
                    Select the irrigation amount (depth) in 0.05-inch increments
                    at least one day before the application.
                  </p>
                </li>
                <li>
                  <p style={{ textAlign: "justify" }}>
                    From planting to harvest, the maximum irrigation depth per
                    application is 0.5 inches.
                  </p>
                </li>
                <li>
                  <p style={{ textAlign: "justify" }}>
                    No irrigation will be applied if no selection is made.
                  </p>
                </li>
              </ul>
            </Container>
            <Typography variant="h6" gutterBottom>
              Soil moisture sensor
            </Typography>
            <div className="field">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {/* Cards for selecting sensor */}
                {sensorOptions.map((sensorOption) => (
                  <Card
                    key={sensorOption}
                    onClick={() => handleSensorCardClick(sensorOption)}
                    sx={{
                      cursor: "pointer",
                      margin: "4px",
                      padding: "10px 16px",
                      backgroundColor:
                        soilMoistureSensor === sensorOption
                          ? "#fa4616"
                          : "#F5F5F5",
                      border:
                        soilMoistureSensor === sensorOption
                          ? "2px solid rgb(255, 255, 255)"
                          : "2px solid rgb(37, 106, 185)",
                      borderRadius: "12px",
                      color:
                        soilMoistureSensor === sensorOption ? "white" : "#333",
                      boxShadow:
                        soilMoistureSensor === sensorOption
                          ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                      transition: "all 0.3s ease-in-out",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      width: "200px", // Set a fixed width for each card
                      height: "50px", // Ensure consistent button size
                      "&:hover": {
                        backgroundColor:
                          soilMoistureSensor === sensorOption
                            ? "#d73a12"
                            : "#E0E0E0",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2">{sensorOption}</Typography>
                    </CardContent>
                  </Card>
                ))}
                <p style={{ textAlign: "justify" }}></p>
                {!isApplicationTypeConfirmed1 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isApplicationTypeConfirmed1}
                        onChange={(event) => {
                          handleApplicationTypeConfirmation1(event);
                          if (event.target.checked) {
                            handleConfirmApplicationType1();
                          }
                        }}
                      />
                    }
                    label="Confirm Soil Moisture Sensor selection by ticking the checkbox (this cannot be changed later once check box is ticked)"
                  />
                )}
                <p style={{ textAlign: "justify" }}></p>
              </div>
              <div>
                {isApplicationTypeConfirmed1 && (
                  <div>
                    <p style={{ textAlign: "justify" }}>
                      Selected Sensor: {soilMoistureSensor}
                    </p>
                    {/* Render any additional information about the sensor here */}
                  </div>
                )}
                {/* Other component markup */}
              </div>

              {/* <div className="control">
              <p style={{ textAlign: "justify" }}></p>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="soilMoistureSensor">
                  Select Sensor
                </InputLabel>
                <Select
                  id="soilMoistureSensor"
                  name="soilMoistureSensor"
                  label="Soil moisture sensor"
                  value={soilMoistureSensor}
                  onChange={(e) => setSoilMoistureSensor(e.target.value)}
                  //disabled={!!soilMoistureSensor} //fix the sensor once selected
                >
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Sentek probe (Holder Ag)">
                    Sentek probe (Holder Ag)
                  </MenuItem>
                  <MenuItem value="BMP logic">BMP logic</MenuItem>
                  <MenuItem value="AquaSpy">AquaSpy</MenuItem>
                </Select>
              </FormControl>
            </div> */}
            </div>
          </>
        )}

        {selectedOption === "evapotranspiration" && (
          <>
            <p style={{ textAlign: "justify" }}>
              {" "}
              Recommonded Corn Irrigation apps for evapotranspiration based
              irrigation scheduling{" "}
              <a href="https://smartirrigationapps.org/corn-app/">
                https://smartirrigationapps.org/corn-app/
              </a>
            </p>
          </>
        )}

        {selectedOption === "calendar" && (
          <p style={{ textAlign: "justify" }}>
            Recommonded Resources for calendar based irrigation scheduling . The
            QR code for resources is available below. Scan the QR code to learn
            more.
          </p>
        )}

        <div
          id="irri-mgmnt-option-tabs"
          className="tabs"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <Tabs
            value={sectionData}
            onChange={(e, newValue) => setSectionData(newValue)}
            aria-label="Irrigation Management Options"
            variant="fullWidth"
          >
            <Tab label="Irrigation" value="v10-harvest" />
            {/* <Tab label="Planting to V10" value="planting-v10" /> */}
          </Tabs>
        </div>
        <div id="irri-mgmnt-option-tab-content" className="tab-content">
          <section data-content="v10-harvest" className="is-active">
            {/* Include the content for "Irrigation" tab */}
            <br></br>
            <div>
              <TextField
                id="date-input"
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                value={displayDate}
                onChange={handleDateChange}
                required
                InputLabelProps={{ shrink: true, required: true }}
                error={error}
                helperText={error ? errorMessage : ""}
              />
              <br></br>
              <br></br>
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
                    <Typography variant="body2">Amount</Typography>
                  </CardContent>
                </Card>

                {amountOptions.map((option) => (
                  <Card
                    key={option}
                    onClick={() => handleAmountCardClick(option)}
                    sx={{
                      cursor: "pointer",
                      margin: "4px",
                      padding: "10px 16px",
                      backgroundColor:
                        amount === option ? "#fa4616" : "#F5F5F5",
                      border:
                        amount === option
                          ? "2px solid rgb(255, 255, 255)"
                          : "2px solid rgb(37, 106, 185)",
                      borderRadius: "12px",
                      color: amount === option ? "white" : "#333",
                      boxShadow:
                        amount === option
                          ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                          : "none",
                      transition: "all 0.3s ease-in-out",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      height: "50px", // Fixed height for better alignment
                      fontWeight: "bold", // Bold text for emphasis
                      "&:hover": {
                        backgroundColor:
                          amount === option ? "#d73a12" : "#E0E0E0",
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

              {/* <Grid item xs={12}>
                <Typography variant="h6">
                  <label
                    style={{
                      display: "inline-block",
                      marginRight: "16px",
                      alignContent: "center",
                    }}
                  >
                    Amount (Inches)
                  </label>
                </Typography>
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  id="select-planting-v10"
                  name="amount"
                  label="Amount (Inches)"
                  variant="outlined"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  required
                />
              </Grid>
              {/* <Button
              id={`irri-mgmnt-planting-v10-add`}
              variant="outlined"
              color="primary"
              onClick={handleAddApplication}
            >
              Add Application
            </Button> */}
            </div>
            {/* Add a submit button */}
            <div>
              {/* <Button
              variant="contained"
              color="primary"
              onClick={submitForm}
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button> */}
              <Button
                id="irrigation-submit"
                style={{ marginTop: "16px" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </section>

          {selectedOption === "soil-moisture" && (
            <TableContainer component={Paper}>
              <card> Selected sensor: </card>
              <Table
                id="irri-mgmnt-v10-harvest-table"
                aria-label="Irrigation Management Table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Sensor</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications
                    .filter((app) => app.options === "soil-moisture")
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sorting by date
                    .map((app, index) => (
                      <TableRow key={app.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{app.date.substring(0, 10)}</TableCell>
                        <TableCell>{app.reading}</TableCell>
                        <TableCell>{app.sensorType}</TableCell>
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
                            {" "}
                            {app.applied === "no" ? (
                              <HighlightOffIcon />
                            ) : (
                              <DoneIcon />
                            )}
                          </button>
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedOption === "evapotranspiration" && (
            <TableContainer component={Paper}>
              <Table
                id="irri-mgmnt-v10-harvest-table"
                aria-label="Irrigation Management Table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications
                    .filter((app) => app.options === "evapotranspiration")
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((app, index) => (
                      <TableRow key={app.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{app.date.substring(0, 10)}</TableCell>
                        <TableCell>{app.reading}</TableCell>
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
                            {" "}
                            {app.applied === "no" ? (
                              <HighlightOffIcon />
                            ) : (
                              <DoneIcon />
                            )}
                          </button>
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedOption === "calendar" && (
            <TableContainer component={Paper}>
              <Table
                id="irri-mgmnt-v10-harvest-table"
                aria-label="Irrigation Management Table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>
                      <EditIcon />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications
                    .filter((app) => app.options === "calendar")
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((app, index) => (
                      <TableRow key={app.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{app.date.substring(0, 10)}</TableCell>
                        <TableCell>{app.reading}</TableCell>
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </form>
    </Container>
  );
}

export default IrrigationManagementForm;
