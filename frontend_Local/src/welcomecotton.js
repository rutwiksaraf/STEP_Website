import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Paper,
  Typography,
  Grid,
  Container,
  Card, // Import Card from Material-UI
  CardContent,
  Box,
  Avatar,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  List,
  ListItemText,
  ListItem,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
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
} from "@mui/material";
import CottonHybridForm from "./cottonHybridSelectionForm";
import CottonSeedingRateForm from "./CottonSeedingRateForm";
import CottonNitrogenManagementForm from "./CottonNitrogenManagementForm";
import CottonIrrigationManagementForm from "./CottonIrrigationManagement";
import CottonInsuranceSelectionForm from "./CottonInsuranceSelectionForm";
import CottonMarketingOptionsForm from "./CottonMarketingOptions";
import CottonGrowthRegulationForm from "./CottonGrowthRegulationForm";
import CottonBulletin from "./CottonBulletin";
import axios from "axios";
import cottonImage from "./cotton.jpg"; // Adjust './cotton.jpg' if your file structure is different
import { saveAs } from "file-saver";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CottonWeatherGraph from "./CottonWeatherChart";

// import GrowthRegulationForm from "./GrowthRegulationForm"; // Import the Growth Regulation form

function WelcomeCotton() {
  // Retrieve stored user data from localStorage
  const teamName = localStorage.getItem("username");
  const username = localStorage.getItem("username");
  const [cottonfiles, setCottonFiles] = useState([]);
  // State to track the currently selected tab
  const [insurance, setInsurance] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [cornuser1, setCornuser1] = useState([]);
  const [teamMembers1, setTeamMembers1] = useState([]);
  const [cottoninsuranceLatest, setCottonInsuranceLatest] = useState([]);
  const [cottonmarketingLatest, setCottonMarketingLatest] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [contractPriceTableData, setContractPriceTableData] = useState([]);
  const token = localStorage.getItem("token");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    fetchContractPrices();
  }, []);

  const fetchContractPrices = () => {
    axios
      .get("/api/cottonGetContractPrices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date) // DESC order
          );
          setContractPriceTableData(sortedData);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("teamName", teamName);
    formData.append("cropType", "cotton");

    try {
      const response = await axios.post("/api/uploadimg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  const handleDownload = (filePath) => {
    axios
      .get(`/api/${filePath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for handling binary files
      })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let fileName = filePath.split("/").pop(); // Default to a filename from the URL
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="([^"]+)"/);
          if (matches.length === 2) {
            fileName = matches[1];
          }
        }
        saveAs(new Blob([response.data]), fileName);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  useEffect(() => {
    if (selectedTab === 0 && cornuser1.length > 0) {
      fetchProfileImage();
    }
  }, [cornuser1]);

  const fetchProfileImage = () => {
    const crop = "cotton";
    const profileImageUrlEndpoint = `/api/getProfileImageUrl/${crop}/${cornuser1[0].teamName}`;
    fetch(profileImageUrlEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => response.text()) // Assuming the response is plain text containing the image URL
      .then((imageUrl) => {
        setProfileImageUrl(imageUrl);
      })
      .catch(() => {
        setProfileImageUrl(
          `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&usqp=CAU`
        ); // Path to your generic image
      });
  };

  // Array of tab names (including the new "Growth Regulation" tab)

  const tabNames = [
    "Profile",
    "Hybrid Selection",
    "Seeding Rate",
    "Nitrogen Management",
    "Growth Regulator", // Add the new tab name here
    "Irrigation Management",
    "Insurance Selection",
    "Marketing Contracts",
    "Bulletin",
    "Weather",
  ];

  // Function to handle tab selection
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listcottonFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCottonFiles(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch users for the Corn crop from the API
    axios
      .post(
        "/api/get_cotton_user",
        {
          teamName: username, // Send 'teamName' in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        setCornuser1(response.data);
        console.log(response.data);
        console.log(cornuser1);
      })
      .catch((error) => {
        console.error("Error fetching Corn users data:", error);
      });
  }, []);

  useEffect(() => {
    if (cornuser1.length > 0) {
      // Assuming you have the team ID in cornuser[0].id
      axios
        .post(
          "/api/cottonTeamMembers",
          {
            id: cornuser1[0]?.id, // Access the team ID from cornuser[0]
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        )
        .then((response) => {
          // Handle the fetched team members data, e.g., set it in state
          console.log(response.data);
          setTeamMembers1(response.data);
        })
        .catch((error) => {
          console.error("Error fetching team members:", error);
        });
    }
  }, [selectedTab, cornuser1]);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/latestcottonInsuranceFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCottonInsuranceLatest(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/latestcottonmarketingFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCottonMarketingLatest(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listCottonInsuranceFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setInsurance(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listCottonMarketingFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMarketing(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  const handleLogout = () => {
    // Clear localStorage or sessionStorage as needed
    localStorage.clear(); // or sessionStorage.clear();

    // Redirect to the login page
    window.location.href = "/login"; // Adjust the path as needed
  };

  return (
    <div>
      {/* <Paper
        elevation={2}
        style={{
          padding: 20,
          margin: 20,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome, {username}!
        </Typography>
      </Paper> */}
      {/* <div style={{ display: "flex" }}> */}
      <div>
        <Container maxWidth="100%">
          <Paper
            elevation={3}
            style={{ marginRight: "16px", overflow: "hidden" }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="secondary"
              // orientation="vertical" // Set tabs to be vertical
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {tabNames.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab}
                  sx={{ alignItems: "flex-start" }}
                />
              ))}
            </Tabs>
          </Paper>
          {/* Render the content for the selected tab */}
          <div>
            <Container maxWidth="100%">
              {/* <p style={{ textAlign: "justify" }}></p> */}
              {/* <Typography variant="h5" alignContent={"center"}>
                Welcome, {username}!
              </Typography> */}
              <br></br>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                boxShadow={1}
              >
                <Typography variant="h5">{tabNames[selectedTab]}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
              {/* <Typography variant="h5">{tabNames[selectedTab]}</Typography> */}
            </Container>
            {/* Content for other tabs (Hybrid Selection, Seeding Rate, etc.) */}
            {selectedTab === 0 && (
              <div
                style={{
                  backgroundImage:
                    "url('https://source.unsplash.com/random/1920x1080?nature')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  minHeight: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px",
                }}
              >
                <Container maxWidth="lg">
                  <Paper
                    elevation={5}
                    style={{
                      padding: "40px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "20px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Grid container spacing={4}>
                      {/* Left Section: Profile Image and User Details */}
                      <Grid item xs={12} md={4}>
                        <div style={{ textAlign: "center" }}>
                          <Typography
                            variant="h4"
                            gutterBottom
                            style={{ fontWeight: "bold", color: "#333" }}
                          >
                            Welcome, {username}!
                          </Typography>
                          <Avatar
                            alt="Profile Image"
                            src={profileImageUrl}
                            sx={{
                              width: 200,
                              height: 200,
                              margin: "20px auto",
                              border: "5px solid #fff",
                              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                            }}
                          />
                          <Paper
                            elevation={2}
                            style={{
                              padding: "25px",
                              borderRadius: "10px",
                              marginBottom: "20px",
                            }}
                          >
                            <Typography
                              variant="h5"
                              gutterBottom
                              style={{ fontWeight: "bold", color: "#333" }}
                            >
                              Update Profile Image
                            </Typography>
                            <form
                              onSubmit={handleUpload}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                              }}
                            >
                              <FormControl>
                                <Input
                                  id="file-input"
                                  type="file"
                                  onChange={handleFileChange}
                                  style={{ display: "none" }}
                                />
                                <label htmlFor="file-input">
                                  <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    style={{ marginRight: "10px" }}
                                  >
                                    Choose File
                                  </Button>
                                </label>
                                <FormHelperText>
                                  Select your profile image (jpg, jpeg, png
                                  format)
                                </FormHelperText>
                              </FormControl>
                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{
                                  borderRadius: "8px",
                                  padding: "10px 20px",
                                  alignSelf: "flex-start",
                                }}
                              >
                                Upload Profile Image
                              </Button>
                            </form>
                          </Paper>
                        </div>
                      </Grid>

                      {/* Right Section: User Details and Image Upload */}
                      <Grid item xs={12} md={8}>
                        <Paper
                          elevation={2}
                          style={{
                            padding: "20px",
                            borderRadius: "10px",
                            marginTop: "30px",
                            marginBottom: "20px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            style={{
                              fontWeight: "bold",
                              marginBottom: "10px",
                            }}
                          >
                            User Information
                          </Typography>
                          {cornuser1.length > 0 && (
                            <>
                              <Typography>
                                Username/TeamName: {cornuser1[0].teamName}
                              </Typography>
                              <Typography>
                                Crop Type: {cornuser1[0].cropType}
                              </Typography>
                              <Typography>
                                Captain: {cornuser1[0].captainFirstName}{" "}
                                {cornuser1[0].captainLastName}
                              </Typography>
                            </>
                          )}
                        </Paper>
                        {cornuser1.length > 0 && (
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <Paper
                                elevation={2}
                                style={{
                                  padding: "20px",
                                  borderRadius: "10px",
                                  height: "100%", // Ensures both papers are the same height
                                  display: "flex", // Enables flexbox
                                  flexDirection: "column", // Aligns content properly
                                  justifyContent: "space-between", // Distributes content evenly
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                  }}
                                >
                                  Location
                                </Typography>
                                <Typography>{cornuser1[0].address1}</Typography>
                                <Typography>{cornuser1[0].address2}</Typography>
                                <Typography>
                                  {cornuser1[0].city}, {cornuser1[0].state}{" "}
                                  {cornuser1[0].zipCode}
                                </Typography>
                                <Typography>{cornuser1[0].country}</Typography>
                              </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Paper
                                elevation={2}
                                style={{
                                  padding: "20px",
                                  borderRadius: "10px",
                                  height: "100%", // Ensures both papers are the same height
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  style={{
                                    fontWeight: "bold",
                                    marginBottom: "10px",
                                  }}
                                >
                                  Contact Information
                                </Typography>
                                <Typography>
                                  Email: {cornuser1[0].email}
                                </Typography>
                                <Typography>
                                  Phone: {cornuser1[0].phone}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        )}

                        {teamMembers1.length > 0 && (
                          <Paper
                            elevation={2}
                            style={{
                              padding: "25px",
                              borderRadius: "10px",
                              marginTop: "20px",
                            }}
                          >
                            <Typography
                              variant="h5"
                              gutterBottom
                              style={{ fontWeight: "bold", color: "#333" }}
                            >
                              Team Members
                            </Typography>
                            <Grid container spacing={2}>
                              {teamMembers1.map((member, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                  <Paper
                                    elevation={1}
                                    style={{
                                      padding: "15px",
                                      borderRadius: "8px",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Team Member {index + 1}
                                    </Typography>
                                    <Typography>Name: {member.name}</Typography>
                                    <Typography>
                                      Email: {member.email}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          </Paper>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Container>
              </div>
            )}
            {selectedTab === 1 && (
              <Container component="main" maxWidth="70%">
                <div>
                  {/* <h3>Hybrid Selection</h3> */}
                  <p style={{ textAlign: "justify" }}>
                    Hybrid selection is a critical step in crop management. It
                    involves choosing the most suitable hybrid varieties for
                    your farming conditions and goals.
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    You can choose one of the default hybrids listed below or
                    source your own seed. If sourcing your own seed, 15 lbs to 2
                    bags of seed must be delivered to the West Florida Research
                    and Education Center located at 4253 Experiment Dr, Jay FL,
                    32565 till May 10th. You must provide documentation of the
                    retail price for any seed that you source.
                  </p>
                  <CottonHybridForm />
                </div>
              </Container>
            )}

            {/* Content for other tabs (Seeding Rate, Nitrogen Management, etc.) */}
            {selectedTab === 2 && (
              <Container component="main" maxWidth="90%">
                <div>
                  {/* <p style={{ textAlign: "justify" }}>
                    Choose any plant population (seeding rate per acre) between
                    24,000 and 40,000 seeds per acre, in increments of 2,000
                    seeds per acre.
                  </p> */}
                  <p></p>
                  <CottonSeedingRateForm />
                </div>
              </Container>
            )}
            {/* Content for other tabs (Nitrogen Management, Irrigation Management, etc.) */}
            {selectedTab === 3 && (
              <Container component="main" maxWidth="90%">
                <div>
                  <p></p>
                  <CottonNitrogenManagementForm />
                </div>
              </Container>
            )}

            {selectedTab === 4 && (
              <Container component="main" maxWidth="90%">
                <div>
                  <p style={{ textAlign: "justify" }}>
                    Growth regulation is essential for optimizing cotton crop
                    yield and quality. You can manage growth through various
                    practices and treatments.
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    Growth Regulator: Pix (Mepiquat Chloride) and Stance will be
                    provided, and you can apply them at any rate as needed.
                  </p>
                  {/* Include any relevant form or input for managing growth regulators if needed */}
                  {/* <GrowthRegulationForm /> */}
                  <CottonGrowthRegulationForm />
                </div>
              </Container>
            )}

            {/* Content for other tabs (Irrigation Management, Insurance Selection, etc.) */}
            {selectedTab === 5 && (
              <Container component="main" maxWidth="90%">
                <div>
                  <CottonIrrigationManagementForm />
                </div>
              </Container>
            )}

            {/* Content for other tabs (Insurance Selection, Marketing Contracts, etc.) */}
            {selectedTab === 6 && (
              <Container component="main" maxWidth="90%">
                <div>
                  <p style={{ textAlign: "justify" }}>
                    Choose a crop insurance plan and coverage level. Options
                    include Yield Protection and Revenue Protection plans at
                    coverage levels ranging from 50% to 85%. Yield Protection
                    insures against low yields relative to a producer’s historic
                    yields. Revenue Protection insures against low yields and
                    low harvest price relative to projected price.
                  </p>

                  <p style={{ textAlign: "justify" }}>
                    Insurance selection must be made by June 2nd. If you do not
                    choose a plan, Yield Protection at the 50% level will be the
                    default. Once your insurance choice has been submitted, it
                    cannot be changed for this year’s contest.
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    To assist with your decision, please see the Insurance Rules
                    & Premiums document and the Crop Insurance Calculator shown
                    on the right side of this webpage.
                  </p>
                  <p style={{ textAlign: "justify" }}>
                    Please choose a plan and coverage level below.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div style={{ flex: 3, minWidth: "400px" }}>
                      <CottonInsuranceSelectionForm />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        border: "1px solid #ccc",
                        padding: "20px",
                        // minHeight: "400px",
                        maxHeight: "400px", // Set a maximum height for the div
                        overflow: "auto", // Add scrollbars if the content exceeds the height
                        minWidth: "300px", // Use a minimum width
                        backgroundImage: `url(${cottonImage})`, // Replace 'imageUrl' with your image URL
                        backgroundSize: "cover", // Ensure the background image covers the entire div
                        backgroundPosition: "center", // Center the background image
                        backgroundRepeat: "no-repeat", // Prevent the background image from repeating
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow for depth
                      }}
                    >
                      <h3
                        style={{
                          textAlign: "center",
                          margin: "0 0 20px 0",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        List of Insurance Files:
                      </h3>

                      <List>
                        {insurance
                          .filter((fileName) => fileName !== "metadata.json")
                          .filter(
                            (fileName) => !fileName.startsWith("profile.")
                          )
                          .filter((fileName) => fileName !== "Thumbs.db")
                          .map((fileName, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                                padding: "10px",
                                margin: "10px 0",
                                borderRadius: "5px", // Consistency in border radius
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // Each item has a subtle shadow
                              }}
                            >
                              {" "}
                              <p
                                style={{
                                  margin: "0 0 10px 0",
                                }}
                              >
                                File Name: {fileName}
                              </p>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() =>
                                  handleDownload(
                                    `downloadInsuranceCottonFile/${fileName}`
                                  )
                                }

                                // href={`/api/downloadInsuranceFile/${fileName.originalFileName}`}
                                // download
                              >
                                Download
                              </Button>
                            </div>
                          ))}
                      </List>
                    </div>
                  </div>
                </div>
              </Container>
            )}
            {selectedTab === 7 && (
              <Container component="main" maxWidth="90%">
                <div style={{ textAlign: "justify" }}>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <div
                      style={{
                        flex: 3,
                        minWidth: "400px",
                        marginRight: "40px",
                      }}
                    >
                      <p style={{ textAlign: "justify" }}>
                        Select the number of bales you would like to forward
                        contract today. Then click Submit. All contracts will be
                        flat-price contracts. The contracted bales will be
                        assigned today’s December futures closing price. Quality
                        premiums and discounts will be estimated after harvest.
                      </p>

                      <p style={{ textAlign: "justify" }}>
                        All contracts must be in increments of 200 bales
                        (~100,000 lbs). You may contract multiple times on
                        different dates up to a maximum of 2400 bales during the
                        season. The forward contract deadline is October 31st.
                        Any bales from your 1000-acre harvest not contracted by
                        October 31st will be spot priced 2 weeks after harvest.
                      </p>

                      <CottonMarketingOptionsForm />
                    </div>
                    <p style={{ textAlign: "justify" }}></p>
                    <div>
                      <div
                        style={{
                          minWidth: "300px",
                          maxWidth: "300px",
                          flexShrink: 0,
                          backgroundColor: "#f4f4f4",
                          borderRadius: "10px",
                          paddingLeft: "30px",
                          paddingRight: "30px",
                          paddingBottom: "10px", // minimize bottom padding
                          marginBottom: "10px", // reduce this if spacing below the table is too much
                          marginTop: "5px",
                          boxSizing: "border-box",
                        }}
                      >
                        <h3
                          style={{
                            textAlign: "center",
                            margin: "0 0 20px 0",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          Contract Prices
                        </h3>
                        <TableContainer
                          component={Paper}
                          style={{
                            marginTop: "20px",
                            maxHeight: "300px", // or any height you prefer
                            overflowY: "auto",
                            marginBottom: 0,
                            borderCollapse: "collapse",
                            borderRadius: "10px",
                          }}
                        >
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "#002657" }}>
                                <TableCell
                                  sx={{ color: "white", fontWeight: "bold" }}
                                >
                                  Date
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ color: "white", fontWeight: "bold" }}
                                >
                                  Contract Price (cents/lb)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {contractPriceTableData.map((row, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    backgroundColor:
                                      index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                                  }}
                                >
                                  <TableCell>
                                    {new Date(row.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row.contractPrice}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          border: "1px solid #ccc",
                          padding: "20px",
                          maxHeight: "400px", // Set a maximum height for the div
                          overflow: "auto", // Add scrollbars if the content exceeds the height
                          minWidth: "250px", // Use a minimum width
                          backgroundImage: `url(${cottonImage})`, // Replace 'imageUrl' with your image URL
                          backgroundSize: "cover", // Ensure the background image covers the entire div
                          backgroundPosition: "center", // Center the background image
                          backgroundRepeat: "no-repeat",
                          borderRadius: "5px", // Added rounded corners
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <h3
                          style={{
                            textAlign: "center",
                            margin: "0 0 20px 0",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          List of Marketing Files:
                        </h3>
                        {marketing
                          .filter((fileName) => fileName !== "metadata.json")
                          .filter((fileName) => fileName !== "profile.jpg")
                          .length > 0 ? (
                          <ul>
                            {marketing
                              .filter(
                                (fileName) => fileName !== "metadata.json"
                              )
                              .filter((fileName) => fileName !== "profile.jpg")
                              .map((fileName, index) => (
                                <div
                                  style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    padding: "10px",
                                    margin: "10px 0",
                                    borderRadius: "5px", // Consistency in border radius
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                  }}
                                  key={index}
                                >
                                  {" "}
                                  <p style={{ margin: "0 0 10px 0" }}>
                                    File Name: <br />
                                    {fileName}
                                  </p>
                                  {/* <p style={{ margin: "0 0 10px 0" }}>
                                  Upload Date:{" "}
                                  {new Date(
                                    fileName.uploadDate
                                  ).toLocaleDateString()}
                                </p> */}
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                      handleDownload(
                                        `downloadMarketingCottonFile/${fileName}`
                                      )
                                    }

                                    // href={`/api/downloadMarketingFile/${fileName.originalFileName}`}
                                    // download
                                  >
                                    Download
                                  </Button>
                                </div>
                              ))}
                          </ul>
                        ) : (
                          <p
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              textAlign: "center",
                              padding: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            No latest files.
                          </p> // Semi-transparent background for text readability
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            )}

            {/* Content for the new "Growth Regulation" tab */}

            {selectedTab === 8 && (
              <Container component="main" maxWidth="90%">
                <CottonBulletin />
              </Container>
            )}
            {selectedTab === 9 && (
              <Container component="main" maxWidth="90%">
                <CottonWeatherGraph stationId="170" />
              </Container>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default WelcomeCotton;
