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

function CottonGrowthRegulationForm() {
  const [regulator, setRegulator] = useState("");
  const [rate, setRate] = useState("");
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState([]);
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
                  backgroundColor:
                    regulator === "Pix (Mepiquat Chloride)"
                      ? "#fa4616"
                      : "#D8D4D7",
                  border: "2px solid #fa4616", // Highlight the selected card
                  marginRight: "30px", // Add margin to separate cards
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
                    regulator === "Stance" ? "#fa4616" : "#D8D4D7", // Highlight the selected card
                  border: "2px solid #fa4616",
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br></br>
          <br></br>

          <div className="block control">
            <TextField
              id="rate"
              label="Rate (any)"
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
                  <TableCell>{data.date}</TableCell>
                  <TableCell>{data.regulator}</TableCell>
                  <TableCell>{data.rate}</TableCell>
                  <TableCell>
                    <button
                      style={{
                        backgroundColor:
                          data.applied === "no" ? "red" : "green",
                        color: "white", // Assuming you want white text for contrast
                        border: "none", // Remove default button border styling
                        // Add any other styling you need here
                      }}
                    >
                      {data.applied === "no" ? (
                        <HighlightOffIcon />
                      ) : (
                        <DoneIcon />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button>
                      {data.applied === "no" ? (
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

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Container,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Typography,
//   TextField,
//   hintText,
// } from "@mui/material";
// import axios from "axios";

// function CottonGrowthRegulationForm() {
//   const [regulator, setRegulator] = useState("");
//   const [rate, setRate] = useState("");
//   const [formData, setFormData] = useState([]);
//   const teamName = localStorage.getItem("username");

//   // Fetch existing insurance selection data for the user
//   //   const fetchInsuranceSelectionData = () => {
//   //     axios
//   //       .post("/api/getInsuranceSelectionForms", {
//   //         username: teamName,
//   //       })
//   //       .then((response) => {
//   //         if (response.status === 200) {
//   //           setFormData(response.data);
//   //         } else {
//   //           console.error("Failed to fetch data from the backend");
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error fetching data:", error);
//   //       });
//   //   };

//   //   // Fetch existing insurance selection data for the user when the component mounts
//   //   useEffect(() => {
//   //     fetchInsuranceSelectionData();
//   //   }, [teamName]);

//   //   const handleSubmit = async () => {
//   //     try {
//   //       // Prepare the data to be sent
//   //       const formDataToSubmit = {
//   //         teamName: teamName,
//   //         coverage: coverage,
//   //         level: level,
//   //       };

//   //       // Send a POST request to your backend endpoint
//   //       const response = await axios
//   //         .post("/api/insurancesubmit", formDataToSubmit)
//   //         .then((response) => {
//   //           // Handle the successful response if needed
//   //           if (response.status === 200) {
//   //             console.log("Application data sent to the backend successfully");
//   //             fetchInsuranceSelectionData();
//   //           } else {
//   //             console.error("Failed to send application data to the backend");
//   //           }
//   //         })
//   //         .catch((error) => {
//   //           // Handle errors
//   //           console.error("Error submitting form:", error);
//   //         });

//   //       // Handle the successful response if needed

//   //       // Fetch updated data after submission
//   //     } catch (error) {
//   //       // Handle errors
//   //       console.error("Error submitting form:", error);
//   //     }
//   //   };

//   return (
//     <Container>
//       <Typography variant="h6" gutterBottom>
//         Growth Regulation
//       </Typography>
//       <div className="field">
//         <div className="block control">
//           <FormControl variant="outlined" fullWidth>
//             <InputLabel htmlFor="select-insurance-coverage">
//               Growth Regulator
//             </InputLabel>
//             <Select
//               id="select-regulator"
//               name="regulator"
//               label="Regulator"
//               value={regulator}
//               onChange={(e) => setRegulator(e.target.value)}
//             >
//               <MenuItem value="Pix (Mepiquat Chloride)">
//                 Pix (Mepiquat Chloride)
//               </MenuItem>
//               <MenuItem value="Stance">Stance</MenuItem>
//             </Select>
//           </FormControl>
//         </div>
//         <br />
//         <div className="block control">
//           <TextField
//             id={`rate`}
//             label="Rate (any)"
//             variant="outlined"
//             fullWidth
//             value={rate}
//             onChange={(e) => setRate(e.target.value)}
//             // helperText={hintText}
//           />
//         </div>
//         <div className="columns">
//           <div className="column">
//             <div className="field">
//               <div className="control">
//                 <Button
//                   id="regulation-selection-submit"
//                   variant="contained"
//                   color="primary"
//                   //   onClick={handleSubmit}
//                 >
//                   Submit
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="column has-text-right">
//             <div className="subtitle is-4" id="insurance-selection-status-msg">
//               {/* Display status message here */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <Typography variant="h6" gutterBottom>
//           Existing Growth Regulator Data
//         </Typography>
//         <ul>
//           {formData.map((data, index) => (
//             <li key={index}>
//               Coverage: {data.coverage}, Level: {data.level}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </Container>
//   );
// }

// export default CottonGrowthRegulationForm;
