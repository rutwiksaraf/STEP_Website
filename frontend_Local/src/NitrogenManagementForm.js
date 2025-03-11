import React, { useState, useEffect } from "react";
import axios from "axios";
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

function NitrogenManagementForm({ sectionData, hintText }) {
  // const [applicationType, setApplicationType] = useState("in-season");
  const [selectedCard, setSelectedCard] = useState(null);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [applications, setApplications] = useState([]);
  const teamName = localStorage.getItem("username");
  const [tableData, setTableData] = useState([]);
  const [subapplicationType, setSubApplicationType] = useState("");
  const [dateToday, setDateToday] = useState(new Date().toISOString());
  const token = localStorage.getItem("token");
  const [productOption, setProductOption] = useState("");
  const [isProductOptionConfirmed, setIsProductOptionConfirmed] =
    useState(false);
  // const [ApplicationType, setApplicationType] = useState("None");
  // const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =
  //   useState(false);
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
      .post("/api/saveApplicationTypeConfirmation", data, {
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

  const handleProductOptionChange = (option) => {
    if (!isProductOptionConfirmed) {
      setProductOption(option);
      handleClick(option)
      
    }
  };

  const handleProductOptionConfirmation = (event) => {
    setIsProductOptionConfirmed(event.target.checked);
    if (event.target.checked) {
      saveProductOptionConfirmationToBackend();
    }
  };

  const saveProductOptionConfirmationToBackend = () => {
    const data = {
      teamName: teamName,
      productOption: productOption,
      isConfirmed: true,
    };
    axios
      .post("/api/saveProductOptionConfirmation", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Product option confirmation saved:", response);
      })
      .catch((error) => {
        console.error("Error saving product option confirmation:", error);
      });
  };

  const handleCardClick = (value) => {
    setApplicationType(value);
  };

  const inseasonOptions = [
    "Broadcast",
    "Banding",
    "Liquidside-Dressing",
    // "Fertigation",
  ];

  //const controlledreleaseOptions = ["Broadcast", "Banding", "Incorporated"];
  const controlledreleaseOptions = ["Broadcast", "Banding"];
  const controlledreleaseProductOptions = [
    "Harrell's: 43-0-0",
    "Pursell: 44.5-0-0",
    "Florikan: 44-0-0",
  ];

  

  const handleClick = (selected) => {
    const subApplicationMapping = {
      "Broadcast": "Broadcast",
      "Banding": "Banding",
      "Incorporated": "Incorporated",
      "Liquidside-Dressing": "liquidside-dressing",
      "Fertigation": "fertigation",
    };

    if (subApplicationMapping[selected]) {
      setSubApplicationType(subApplicationMapping[selected]);
    }

    setSelectedCard(selectedCard === selected ? null : selected);
  };

  useEffect(
    () => {
      // Fetch data from the backend when the component mounts
      fetchApplicationTypeConfirmation();
      fetchDataFromBackend();
    },
    [applicationType],
    [productOption]
  ); // Fetch data whenever applicationType changes

  const fetchApplicationTypeConfirmation = () => {
    axios
      .get("/api/getApplicationTypeConfirmation", {
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
      .delete(`/api/deletenitrogenApplication/${appId}`, {
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

  const fetchDataFromBackend = () => {
    // Make an API request to fetch data from the backend based on the application type
    axios
      .get("/api/fetchNitrogenManagementData", {
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

    if (applicationType === "in-season") {
      // Customize the object for in-season type
      newApplication = {
        applicationType: applicationType,
        date: date,
        amount: amount,
        placement: subapplicationType, // Initialize as an empty array
        teamName,
        applied: "no",
        dateToday: dateToday,
      };

      // Add placement options to the array if they are true
      // if (broadcast) newApplication.placement.push("Broadcast");
      // if (sideDressed) newApplication.placement.push("Side-dressed");
      // if (liquidSideDressing)
      //   newApplication.placement.push("Liquid Side-dressing");

      // // Convert the placement array to a comma-separated string
      // newApplication.placement = newApplication.placement.join(", ");
    } else if (applicationType === "controlled-release") {
      // Customize the object for controlled-release type
      newApplication = {
        applicationType: applicationType,
        // Add additional fields specific to controlled-release type
        // Example: controlledReleaseField: controlledReleaseValue,
        date: date,
        amount: amount,
        placement: subapplicationType,
        teamName,
        applied: "no",
        dateToday: dateToday,
        productOption: productOption,
      };
    }

    // Add the new application to the local state
    setApplications([...applications, newApplication]);

    // Clear the form fields
    setDate("");
    setAmount("");

    // Send the new application data to the backend
    sendApplicationDataToBackend(newApplication);
  };

  // Function to send application data to the backend using Axios
  const sendApplicationDataToBackend = (applicationData) => {
    axios
      .post("/api/nitrogenmanagementsubmit", applicationData, {
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

  const usHolidays = [
    "2025-01-01", // New Year's Day
    "2025-07-04", // Independence Day
    "2025-11-11", // Veterans Day
    "2025-12-25", // Christmas Day
  ];

  const getDynamicHolidays = (year) => {
    const holidays = [];

    // Martin Luther King Jr. Day (Third Monday of January)
    const mlkDay = new Date(year, 0, 1);
    while (mlkDay.getDay() !== 1) mlkDay.setDate(mlkDay.getDate() + 1);
    mlkDay.setDate(mlkDay.getDate() + 14); // Third Monday
    holidays.push(mlkDay.toISOString().split("T")[0]);

    // Presidents' Day (Third Monday of February)
    const presidentsDay = new Date(year, 1, 1);
    while (presidentsDay.getDay() !== 1)
      presidentsDay.setDate(presidentsDay.getDate() + 1);
    presidentsDay.setDate(presidentsDay.getDate() + 14);
    holidays.push(presidentsDay.toISOString().split("T")[0]);

    // Memorial Day (Last Monday of May)
    const memorialDay = new Date(year, 4, 31);
    while (memorialDay.getDay() !== 1)
      memorialDay.setDate(memorialDay.getDate() - 1);
    holidays.push(memorialDay.toISOString().split("T")[0]);

    // Labor Day (First Monday of September)
    const laborDay = new Date(year, 8, 1);
    while (laborDay.getDay() !== 1) laborDay.setDate(laborDay.getDate() + 1);
    holidays.push(laborDay.toISOString().split("T")[0]);

    // Thanksgiving (Fourth Thursday of November)
    const thanksgiving = new Date(year, 10, 1);
    while (thanksgiving.getDay() !== 4)
      thanksgiving.setDate(thanksgiving.getDate() + 1);
    thanksgiving.setDate(thanksgiving.getDate() + 21);
    holidays.push(thanksgiving.toISOString().split("T")[0]);

    return holidays;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
    const year = dateObj.getFullYear();

    // Get full list of holidays
    const allHolidays = [...usHolidays, ...getDynamicHolidays(year)];

    if (dayOfWeek === 5 || dayOfWeek === 6) {
      setError(true);
      setErrorMessage("No Nitrogen inputs can be applied on weekends.");
    } else if (allHolidays.includes(selectedDate)) {
      setError(true);
      setErrorMessage(
        "Selected date is a U.S. public holiday. No Nitrogen inputs can be applied on public holidays."
      );
    } else {
      setError(false);
      setErrorMessage("");
      setDate(selectedDate);
    }
  };

  return (
    <div>
      <form onSubmit={handleAddApplication}>
        {/* <Typography variant="h6" gutterBottom>
        Add Application
      </Typography> */}
        {/* <div style={{ display: "flex", flexDirection: "row" }}>
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
            <FormControlLabel
              value="controlled-release"
              control={<Radio />}
              label="Controlled-Release Fertilizer"
            />
          </RadioGroup>
        </FormControl>
      </div> */}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card
              onClick={() =>
                !isApplicationTypeConfirmed && handleCardClick("in-season")
              }
              sx={{
                cursor: !isApplicationTypeConfirmed ? "pointer" : "not-allowed",
                margin: "4px",
                padding: "10px 16px",
                backgroundColor:
                  applicationType === "in-season" ? "#fa4616" : "#F5F5F5",
                border:
                  applicationType === "in-season"
                    ? "2px solid rgb(255, 255, 255)"
                    : "2px solid rgb(37, 106, 185)",
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
                opacity:
                  isApplicationTypeConfirmed && applicationType !== "in-season"
                    ? 0.5
                    : 1,
                "&:hover": {
                  backgroundColor:
                    applicationType === "in-season" ? "#d73a12" : "#E0E0E0",
                  transform: !isApplicationTypeConfirmed
                    ? "scale(1.05)"
                    : "none",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
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
                opacity:
                  isApplicationTypeConfirmed &&
                  applicationType !== "controlled-release"
                    ? 0.5
                    : 1,
                "&:hover": {
                  backgroundColor:
                    applicationType === "controlled-release"
                      ? "#d73a12"
                      : "#E0E0E0",
                  transform: !isApplicationTypeConfirmed
                    ? "scale(1.05)"
                    : "none",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Controlled-Release Fertilizer
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
          label="Confirm application type by ticking the checkbox (application type cannot be changed later once check box is ticked)"
        />

        {applicationType === "in-season" && (
          <>
            <p style={{ textAlign: "justify" }}>
              Choose the application method, date, and amount of N to apply.
              After planting until V8, you can choose either broadcasting or
              banding of dry ammonium nitrate. After V8, all fertilizer
              applications will be liquid side-dressing of UAN 28% (using the
              Miller Highboy with Y-drops). Liquid side-dressing can be applied
              only once each week on a fixed day (Thursday). The minimum amount
              of N per application is 24 lbs/ac.
            </p>

            <p style={{ textAlign: "justify" }}>
              In case of a leaching rain event (determined by the project
              management team), an additional application of N at 30 lbs/ac will
              be allowed. Participating teams will be responsible to communicate
              their decision at least three days in advance.
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
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        {option}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Grid>
            <br></br>
            <Grid item xs={12}>
              <Typography variant="h6">
                <label
                  style={{
                    display: "inline-block",
                    marginRight: "16px",
                    alignContent: "center",
                  }}
                >
                  Application Type
                </label>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                labelId="subapplicationtype-label"
                id="subapplicationtype"
                label="Application Type"
                variant="outlined"
                fullWidth
                value={subapplicationType}
                onChange={(e) => setSubApplicationType(e.target.value)}
                placeholder="Application Type"
                required
              />
            </Grid>
            <br></br>
          </>
        )}

        {applicationType === "controlled-release" && (
          <>
            <p style={{ textAlign: "justify" }}>
              Controlled-Release Fertilizer Program, For the CRF program, you
              can choose any CRF rate ranging from 150 to 300 lbs/ac of N. All
              the CRF applications will be applied at planting.
            </p>

            <p style={{ textAlign: "justify" }}>
              In case of a leaching rain event (determined by the project
              management team), an additional application of N at 30 lbs/ac will
              be allowed. Participating teams will be responsible to communicate
              their decision at least three days in advance.
            </p>

            <Grid item xs={12}>
              <Typography variant="h5">
                Controlled Release Fertilizer Product Options:
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {controlledreleaseProductOptions.map((option) => (
                  <Card
                    key={option}
                    onClick={() => handleProductOptionChange(option)}
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

            <FormControlLabel
              control={
                <Checkbox
                  sx={{ paddingBottom: 2 }}
                  checked={isProductOptionConfirmed}
                  onChange={handleProductOptionConfirmation}
                />
              }
              label="Confirm application type by ticking the checkbox (application type cannot be changed later once check box is ticked)"
            />

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
              <Typography variant="h6">
                <label
                  style={{
                    display: "inline-block",
                    marginRight: "16px",
                    alignContent: "center",
                  }}
                >
                  Application Type
                </label>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                labelId="subapplicationtype-label"
                id="subapplicationtype"
                label="Application Type"
                variant="outlined"
                fullWidth
                value={subapplicationType}
                onChange={(e) => setSubApplicationType(e.target.value)}
                placeholder="Application Type"
                required
              />
            </Grid>
            <br></br>
          </>
        )}
        <TextField
          id="date-input"
          label="Date"
          variant="outlined"
          fullWidth
          type="date"
          value={date}
          onChange={handleDateChange}
          required
          InputLabelProps={{ shrink: true, required: true }}
          error={error}
          helperText={error ? errorMessage : ""}
        />

        <br></br>
        <br></br>

        <TextField
          id={`${sectionData}-amount-input`}
          label="Amount (lbs/acre on N)"
          variant="outlined"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required // Make this field required
          InputProps={{
            required: true, // Add the 'required' prop here
          }}
          // error={!amount} // Set error to true when the field is empty
          // helperText={!amount ? "Fill out this field" : ""}
        />
        <p style={{ textAlign: "justify" }}></p>
        {/* <Button
          id={`n2-mgmnt-${sectionData}-add`}
          variant="contained"
          color="primary"
          onClick={handleAddApplication}
        >
          Add Application
        </Button> */}
        <Button
          id={`n2-mgmnt-${sectionData}-add`}
          variant="contained"
          color="primary"
          type="submit"
        >
          Add Application
        </Button>
      </form>
      <Typography variant="h6" gutterBottom>
        Application Data
      </Typography>
      <TableContainer component={Paper}>
        <Table id={`table-n2-mgmnt-${sectionData}`}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>

              <TableCell>Application Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>placement</TableCell>
              <TableCell>Applied</TableCell>
              <TableCell>
                <EditIcon />
              </TableCell>
              {/* {applicationType === "in-season" && (
                <TableCell>placement</TableCell>
              )} */}
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
    </div>
  );
}

export default NitrogenManagementForm;
