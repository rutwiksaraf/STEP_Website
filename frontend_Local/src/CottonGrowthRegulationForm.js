import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import DeleteIcon from "@mui/icons-material/Delete";
import { fromZonedTime, format, toZonedTime  } from "date-fns-tz";

function CottonGrowthRegulationForm() {
  const [regulator, setRegulator] = useState("");
  const [rate, setRate] = useState("");
  const [date, setDate] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState([]);
  
  const getLocalMidnightUTC = () => {
  const timeZone = "America/Chicago";
  const now = new Date();
  const localDateString = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const localMidnight = new Date(`${localDateString}T00:00:00`);
  const utcMidnight = fromZonedTime(localMidnight, timeZone);
  return utcMidnight.toISOString();
};

const [dateToday, setDateToday] = useState(getLocalMidnightUTC());



  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const handleCardClick = (value) => {
    setRegulator(value);
  };

  // Fetch existing growth regulator data for the user
  const fetchGrowthRegulatorData = () => {
    axios
      .get("/api/cottonFetchGrowthRegulation", {
        params: { teamName: teamName },

        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
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

  const handleDeleteGrowthApplication = (appId) => {
    axios
      .delete(`/api/deletecottongrowthApplication/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          fetchGrowthRegulatorData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  // Fetch existing growth regulator data for the user when the component mounts
  useEffect(() => {
    fetchGrowthRegulatorData();
  }, [teamName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to be sent
      const formDataToSubmit = {
        teamName: teamName,
        date: date, // Assuming you want to capture the date
        regulator: regulator,
        rate: rate,
        applied: false,
        dateToday: dateToday,
      };

      // Send a POST request to your backend endpoint
      const response = await axios.post(
        "/api/cottonInsertGrowthRegulation",
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        console.log("Data sent to the backend successfully");
        // Clear the form fields
        setRegulator("");
        setRate("");
        setDate("");
        // Fetch updated data after submission
        fetchGrowthRegulatorData();
      } else {
        console.error("Failed to send data to the backend");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
  const selectedDate = e.target.value; // e.g., "2025-06-01"
  const timeZone = "America/Chicago";

  console.log("Selected date (raw):", selectedDate);

  // Step 1: Convert local date string to zoned Chicago midnight
  const chicagoMidnight = fromZonedTime(`${selectedDate}T00:00:00`, timeZone); // ✅ correct interpretation

  // Step 2: Get Chicago-local view of this Date object
  const zoned = toZonedTime(chicagoMidnight, timeZone);
  console.log("Chicago-local zoned time:", zoned);

  const dayOfWeek = zoned.getDay();
  const year = zoned.getFullYear();
  const allHolidays = [...usHolidays, ...getDynamicHolidays(year)];

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    setError(true);
    setErrorMessage("No Growth Regulators can be applied on weekends.");
    setDisplayDate("");
    setDate("");
    return;
  }

  if (allHolidays.includes(selectedDate)) {
    setError(true);
    setErrorMessage("Selected date is a U.S. public holiday.");
    setDisplayDate("");
    setDate("");
    return;
  }

  setError(false);
  setErrorMessage("");
  setDisplayDate(selectedDate); // what user sees
  setDate(chicagoMidnight.toISOString()); // what you store (UTC)
};


  const formatDateForDisplay = (isoString) => {
  if (!isoString) return "";
  const timeZone = "America/Chicago"; // Jay, FL
  const zoned = fromZonedTime(isoString, timeZone);
  return format(zoned, "yyyy-MM-dd");
};


  return (
    <Container>
      {/* <Typography variant="h6" gutterBottom>
        Growth Regulator
      </Typography> */}
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <div className="block control">
            <div style={{ display: "flex" }}>
              {/* Cards for selecting contract type */}
              <Card
                onClick={() => handleCardClick("Pix (Mepiquat Chloride)")}
                sx={{
                  cursor: "pointer",
                  padding: "10px",
                  marginRight: "20px",
                  backgroundColor:
                    regulator === "Pix (Mepiquat Chloride)"
                      ? "#fa4616"
                      : "#F5F5F5",
                  border:
                    regulator === "Pix (Mepiquat Chloride)"
                      ? "2px solid rgb(255, 255, 255)"
                      : "2px solid rgb(37, 106, 185)",
                  borderRadius: "12px",
                  color:
                    regulator === "Pix (Mepiquat Chloride)" ? "white" : "#333",
                  boxShadow:
                    regulator === "Pix (Mepiquat Chloride)"
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
                      regulator === "Pix (Mepiquat Chloride)"
                        ? "#d73a12"
                        : "#E0E0E0",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body2">
                    Pix (Mepiquat Chloride)
                  </Typography>
                </CardContent>
              </Card>
              <Card
                onClick={() => handleCardClick("Stance")}
                sx={{
                  cursor: "pointer",
                  padding: "10px",
                  backgroundColor:
                    regulator === "Stance" ? "#fa4616" : "#F5F5F5", // Highlight the selected card
                  border:
                    regulator === "Stance"
                      ? "2px solid rgb(255, 255, 255)"
                      : "2px solid rgb(37, 106, 185)",
                  borderRadius: "12px",
                  color: regulator === "Stance" ? "white" : "#333",
                  boxShadow:
                    regulator === "Stance"
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
                      regulator === "Stance" ? "#d73a12" : "#E0E0E0",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body2">Stance</Typography>
                </CardContent>
              </Card>
            </div>
            <p style={{ textAlign: "justify" }}></p>

            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="select-regulator">Regulator</InputLabel>
              <Select
                id="select-regulator"
                name="regulator"
                label="Regulator"
                value={regulator}
                onChange={(e) => setRegulator(e.target.value)}
                required
              >
                <MenuItem value="">Select Regulator</MenuItem>
                <MenuItem value="Pix (Mepiquat Chloride)">
                  Pix (Mepiquat Chloride)
                </MenuItem>
                <MenuItem value="Stance">Stance</MenuItem>
              </Select>
            </FormControl> */}
          </div>
          <br />
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

          <div className="block control">
            <TextField
              id="rate"
              label="Rate (oz/acre)"
              variant="outlined"
              fullWidth
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
            />
          </div>
          <br></br>
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="control">
                  <Button
                    id="regulation-selection-submit"
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginTop: "16px" }}
                    // onClick={handleSubmit}
                    disabled={!regulator || !rate || !date}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Existing Growth Regulator Data */}
      <div>
        <Typography variant="h6" gutterBottom>
          Existing Growth Regulator Data
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="existing-growth-regulator-data">
            <TableHead>
              <TableRow>
                {/* <TableCell>Team Name</TableCell> */}
                <TableCell>Date</TableCell>
                <TableCell>Regulator</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>
                  <EditIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.map((data, index) => (
                <TableRow key={index}>
                  {/* <TableCell>{data.teamName}</TableCell> */}
                  <TableCell>{formatDateForDisplay(data.date)}</TableCell>

                  <TableCell>{data.regulator}</TableCell>
                  <TableCell>{data.rate}</TableCell>
                  <TableCell>
                    <button
                      style={{
                        backgroundColor:
                          data.applied === false ? "red" : "green",
                        color: "white", // Assuming you want white text for contrast
                        border: "none", // Remove default button border styling
                        // Add any other styling you need here
                      }}
                    >
                      {data.applied === false ? (
                        <HighlightOffIcon />
                      ) : (
                        <DoneIcon />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button>
                      {data.applied === false ? (
                        <DeleteIcon
                          onClick={() => handleDeleteGrowthApplication(data.id)}
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
      </div>
    </Container>
  );
}

export default CottonGrowthRegulationForm;
