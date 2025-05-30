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
import { fromZonedTime, format } from "date-fns-tz";

function CottonIrrigationManagementForm() {
  const [sectionData, setSectionData] = useState("v10-harvest");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [applications, setApplications] = useState([]);
  const teamName = localStorage.getItem("username");
  const sensorOptions = ["BMP logic", "AquaSpy"];
  // const [selectedOption, setSelectedOption] = useState("");
  const token = localStorage.getItem("token");
  const [displayDate, setDisplayDate] = useState("");

  const getTodayMidnightUTC = () => {
  const timeZone = "America/Chicago";
  const now = new Date();
  const dateOnly = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const localMidnight = new Date(`${dateOnly}T00:00:00`);
  return fromZonedTime(localMidnight, timeZone).toISOString();
};

const [dateToday, setDateToday] = useState(getTodayMidnightUTC());



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
      optionConfirmed: 1,
    };

    axios
      .post("/api/saveIrrigationApplicationTypeConfirmationCotton", data, {
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
      sensorType: soilMoistureSensor,
      sensorConfirmed: 1,
    };
    axios
      .post("/api/saveMoistureApplicationTypeConfirmationCotton", data, {
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
    fetchApplicationTypeConfirmation();
    fetchApplicationTypeConfirmation1();
    fetchData();
  }, []); // Fetch data whenever applicationType changes

  const fetchApplicationTypeConfirmation = () => {
    axios
      .get("/api/getIrrigationApplicationTypeConfirmationCotton", {
        params: { teamName: teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setSelectedOption(response.data.applicationType);
          setIsApplicationTypeConfirmed(response.data.optionConfirmed);
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
      .get("/api/getMoistureApplicationTypeConfirmationCotton", {
        params: { teamName: teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setSoilMoistureSensor(response.data.sensorType);
          setIsApplicationTypeConfirmed1(response.data.sensorConfirmed);
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
      .delete(`/api/deletecottonirrigationApplication/${appId}`, {
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
      .get("/api/cottonfetchSoilMoistureSensorData", {
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
        console.log(response);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  };

  // Call the fetchData function when the component mounts
  // useEffect(() => {
  //   fetchData();
  // }, []);

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
    const formData = {
      date: date,
      reading: amount,
      options: selectedOption,
      applied: "no",
      teamName,
      sensorType: soilMoistureSensor, // always include
      dateToday: dateToday,
      applicationType: selectedOption,
      sensorConfirmed: isApplicationTypeConfirmed1,
      optionConfirmed: isApplicationTypeConfirmed,
    };

    // Send a POST request to your backend endpoint
    axios
      .post("/api/cottonsoilmoisturesensorsubmit", formData, {
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

    // Memorial Day (Last Monday of May)
    // const memorialDay = new Date(year, 4, 31);
    // while (memorialDay.getDay() !== 1)
    //   memorialDay.setDate(memorialDay.getDate() - 1);
    // holidays.push(memorialDay.toISOString().split("T")[0]);

    // Labor Day (First Monday of September)
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
    setDisplayDate("");
    setDate("");
  } else if (allHolidays.includes(selectedDate)) {
    setError(true);
    setErrorMessage(
      "Selected date is a U.S. public holiday. No Irrigation inputs can be applied on public holidays."
    );
    setDisplayDate("");
    setDate("");
  } else {
    setError(false);
    setErrorMessage("");

    const timeZone = "America/Chicago";
    const localMidnight = new Date(`${selectedDate}T00:00:00`);
    const utcDate = fromZonedTime(localMidnight, timeZone);

    setDisplayDate(selectedDate);       // For UI display
    setDate(utcDate.toISOString());     // UTC value for backend
  }
};

  const issensorSelected = applications.length > 0;

  const formatDateForDisplay = (isoString) => {
      if (!isoString) return "";
      const timeZone = "America/Chicago"; // Jay, FL
      const zoned = fromZonedTime(isoString, timeZone);
      return format(zoned, "yyyy-MM-dd");
    };

  
  return (
    <Container>
      <form onSubmit={submitForm}>
        <Grid item xs={12}>
          <h4>You have three options for irrigation management:</h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Card
              onClick={() =>
                !issensorSelected && handleCardClick("soil-moisture")
              }
              sx={{
                cursor: issensorSelected ? "not-allowed" : "pointer",
                pointerEvents: issensorSelected ? "none" : "auto",
                opacity: issensorSelected ? 0.6 : 1,
                margin: "4px",
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
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                textAlign: "center", // Ensures text stays centered
                height: "50px", // Fixed height for better alignment
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
              onClick={() =>
                !issensorSelected && handleCardClick("evapotranspiration")
              }
              sx={{
                cursor: issensorSelected ? "not-allowed" : "pointer",
                pointerEvents: issensorSelected ? "none" : "auto",
                opacity: issensorSelected ? 0.6 : 1,
                margin: "4px",
                padding: "10px 16px",
                backgroundColor:
                  selectedOption === "evapotranspiration"
                    ? "#fa4616"
                    : "#F5F5F5",
                border:
                  selectedOption === "soil-moisture"
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
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                textAlign: "center", // Ensures text stays centered
                height: "50px", // Fixed height for better alignment
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
              onClick={() => !issensorSelected && handleCardClick("calendar")}
              sx={{
                cursor: issensorSelected ? "not-allowed" : "pointer",
                pointerEvents: issensorSelected ? "none" : "auto",
                opacity: issensorSelected ? 0.6 : 1,
                margin: "4px",
                padding: "10px 16px",
                backgroundColor:
                  selectedOption === "calendar" ? "#fa4616" : "#F5F5F5",
                border:
                  selectedOption === "soil-moisture"
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
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                textAlign: "center", // Ensures text stays centered
                height: "50px", // Fixed height for better alignment
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
        {/* {!isApplicationTypeConfirmed && ( */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmApplicationType}
          disabled={isApplicationTypeConfirmed} // this line is redundant due to the surrounding conditional rendering
        >
          Submit Irrigation Management Option (this cannot be changed later)
        </Button>
        {/* )} */}
        <p></p>

        {isApplicationTypeConfirmed && (
          <div>
            <>
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

              <Typography variant="h6" gutterBottom>
                Soil moisture sensor
              </Typography>
              <div className="field">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {/* Cards for selecting sensor */}
                  {sensorOptions.map((sensorOption) => (
                    <Card
                      key={sensorOption}
                      onClick={() =>
                        !isApplicationTypeConfirmed1 &&
                        handleSensorCardClick(sensorOption)
                      }
                      sx={{
                        cursor: isApplicationTypeConfirmed1
                          ? "not-allowed"
                          : "pointer",
                        pointerEvents: isApplicationTypeConfirmed1
                          ? "none"
                          : "auto",
                        opacity: isApplicationTypeConfirmed1 ? 0.6 : 1,
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
                          soilMoistureSensor === sensorOption
                            ? "white"
                            : "#333",
                        boxShadow:
                          soilMoistureSensor === sensorOption
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
                  {/* {!isApplicationTypeConfirmed1 && ( */}
                  <br></br>

                  {/* )} */}
                  <p style={{ textAlign: "justify" }}></p>
                </div>
                <p></p>

                {/* <div>
                  {isApplicationTypeConfirmed1 && (
                    <div>
                      <p style={{ textAlign: "justify" }}>
                        Selected Sensor: {soilMoistureSensor}
                      </p>
                    </div>
                  )}
                </div>
                <p></p> */}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmApplicationType1}
                disabled={isApplicationTypeConfirmed1} // Technically redundant because of the conditional rendering
              >
                Submit Soil Moisture Sensor Selection (this cannot be changed
                later)
              </Button>
            </>
          </div>
        )}

        <p>Soil-Moisture Sensor Selected: {soilMoistureSensor}</p>

        {selectedOption === "evapotranspiration" && (
          <>
            <p style={{ textAlign: "justify" }}>
              {" "}
              Recommended Irrigation apps for evapotranspiration based
              irrigation scheduling{" "}
              <a href="https://smartirrigationapps.org/cotton-app/">
                https://smartirrigationapps.org/cotton-app/
              </a>
            </p>
          </>
        )}

        {selectedOption === "calendar" && (
          <p style={{ textAlign: "justify" }}>
            Recommended Resources for calendar based irrigation scheduling . The
            QR code for resources is available below. Scan the QR code to learn
            more.
          </p>
        )}

        {/* {isApplicationTypeConfirmed && ( */}
        {isApplicationTypeConfirmed && isApplicationTypeConfirmed1 && (
          <>
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

                <div>
                  <h4> Planting to V10</h4>
                  <TextField
                    id="date-input-planting-v10"
                    label="Date"
                    variant="outlined"
                    fullWidth
                    type="date"
                    value={displayDate}

                    onChange={handleDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                          justifyContent: "center", // Center horizontally
                          alignItems: "center", // Center vertically
                          textAlign: "center", // Ensures text stays centered
                          height: "50px", // Fixed height for better alignment
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
                </div>
                {/* Add a submit button */}
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                    style={{ marginTop: "16px" }}
                    disabled={
                      !soilMoistureSensor || !selectedOption || !date || !amount
                    }
                  >
                    Submit
                  </Button>
                </div>
              </section>
              {selectedOption === "soil-moisture" && (
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
                        {/* <TableCell>Sensor</TableCell> */}
                        <TableCell>Applied</TableCell>
                        <TableCell>
                          <EditIcon />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications
                        .filter((app) => app.options === "soil-moisture")
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((app, index) => (
                          <TableRow key={app.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{formatDateForDisplay(app.date)}</TableCell>
                            <TableCell>{app.reading}</TableCell>
                            {/* <TableCell>{app.sensorType}</TableCell> */}
                            {/* <TableCell>{app.applied}</TableCell> */}
                            <TableCell>
                              {" "}
                              {/* {app.applied === "no" ? (
                                <HighlightOffIcon />
                              ) : (
                                <DoneIcon />  
                              )} */}
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
                            {/* <TableCell>Icon</TableCell> */}
                            <TableCell>
                              <button>
                                {app.applied === "no" ? (
                                  <DeleteIcon
                                    onClick={() =>
                                      handleDeleteApplication(app.id)
                                    }
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
                            <TableCell>{formatDateForDisplay(app.date)}</TableCell>
                            <TableCell>{app.reading}</TableCell>
                            <TableCell>
                              {" "}
                              {/* {app.applied === "no" ? (
                                <HighlightOffIcon />
                              ) : (
                                <DoneIcon />  
                              )} */}
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
                                    onClick={() =>
                                      handleDeleteApplication(app.id)
                                    }
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
                            <TableCell>{formatDateForDisplay(app.date)}</TableCell>
                            <TableCell>{app.reading}</TableCell>
                            <TableCell>
                              {" "}
                              {/* {app.applied === "no" ? (
                                <HighlightOffIcon />
                              ) : (
                                <DoneIcon />  
                              )} */}
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
                                    onClick={() =>
                                      handleDeleteApplication(app.id)
                                    }
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
          </>
        )}
      </form>
    </Container>
  );
}

export default CottonIrrigationManagementForm;
