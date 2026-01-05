import React, { useState, useEffect } from "react";
import HybridForm from "./HybridSelecionForm";
import SeedingRateForm from "./SeedingRateForm";
import NitrogenManagementForm from "./NitrogenManagementForm";
import IrrigationManagementForm from "./IrrigationManagementForm";
import InsuranceSelectionForm from "./InsuranceSelectionForm";
import MarketingOptionsForm from "./MarketingOptionsForm";
import CornBulletin from "./Bulletin";
import UserDetails from "./UserDetails";
import axios from "axios";
import { CardMedia } from "@mui/material";
import cornImage from "./cornimg.jpg";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  Avatar,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  Container,
  Card, // Import Card from Material-UI
  CardContent, // Import CardContent from Material-UI
  Box,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@mui/material";
import { CenterFocusStrong } from "@mui/icons-material";
import { saveAs } from "file-saver";
import profileImage from "./profile.jpg";
import RainfallChart from "./weatherChart";

function Welcome() {
  // Retrieve stored user data from localStorage

  const username = localStorage.getItem("username");
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // State to track the currently selected tab
  const [selectedTab, setSelectedTab] = useState(0);

  const [files, setFiles] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [insuranceLatest, setInsuranceLatest] = useState([]);
  const [marketingLatest, setMarketingLatest] = useState([]);
  const [cornuser, setCornuser] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [files1, setFiles1] = useState([]);
  const [fileInput, setFileInput] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(profileImage);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
    formData.append("cropType", "corn");

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
    fetchCornUsers();
  }, []);

  useEffect(() => {
    if (selectedTab === 0 && cornuser.length > 0) {
      fetchProfileImage();
    }
  }, [cornuser]);

  const fetchProfileImage = () => {
    const profileImageUrlEndpoint = `/api/getProfileImageUrl/${cornuser[0].cropType}/${cornuser[0].teamName}`;

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
        setProfileImageUrl("./profile.jpg"); // Path to your generic image
      });
  };

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setFiles(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  const fetchCornUsers = () => {
    axios
      .post(
        "/api/get_corn_user",
        {
          teamName: teamName, // Send 'teamName' in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        setCornuser(response.data);
        // console.log(response.data);
        // console.log(cornuser);
      })
      .catch((error) => {
        console.error("Error fetching Corn users data:", error);
      });
  };

  useEffect(() => {
    if (cornuser.length > 0) {
      // Assuming you have the team ID in cornuser[0].id
      axios
        .post(
          "/api/cornTeamMembers",
          {
            id: cornuser[0]?.id, // Access the team ID from cornuser[0]
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
          setTeamMembers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching team members:", error);
        });
    }
  }, [selectedTab, cornuser]);

  useEffect(() => {
    console.log(cornuser);
  }, [cornuser]);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listInsuranceFiles", {
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
      .get("/api/latestinsuranceFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setInsuranceLatest(response.data.files);
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
      .get("/api/listMarketingFiles", {
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

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/latestmarketingFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMarketingLatest(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  // Array of tab names
  const tabNames = [
    "Profile",
    "Hybrid Selection",
    "Seeding Rate",
    "Nitrogen Management",
    "Irrigation Management",
    "Insurance Selection",
    "Marketing Options",
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
      .get("/api/listFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setFiles(response.data.files);
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
      {/* <div >//style={{ display: "flex" }}> */}
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
              textColor="primary"
              variant="scrollable" // Enable scrollable tabs
              scrollButtons="auto" // Show scroll buttons automatically when needed
              allowScrollButtonsMobile // Allow scroll buttons on mobile devices
            >
              {tabNames.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab}

                  // Removed sx prop for simplicity, adjust if needed
                />
              ))}
            </Tabs>
          </Paper>

          <div>
            <Container maxWidth="100%">
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
                            {cornuser.length > 0 && (
                              <>
                                <Typography>
                                  Username/TeamName: {cornuser[0].teamName}
                                </Typography>
                                <Typography>
                                  Crop Type: {cornuser[0].cropType}
                                </Typography>
                                <Typography>
                                  Captain: {cornuser[0].captainFirstName}{" "}
                                  {cornuser[0].captainLastName}
                                </Typography>
                              </>
                            )}
                          </Paper>
                          {cornuser.length > 0 && (
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
                                  <Typography>
                                    {cornuser[0].address1}
                                  </Typography>
                                  <Typography>
                                    {cornuser[0].address2}
                                  </Typography>
                                  <Typography>
                                    {cornuser[0].city}, {cornuser[0].state}{" "}
                                    {cornuser[0].zipCode}
                                  </Typography>
                                  <Typography>{cornuser[0].country}</Typography>
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
                                    Email: {cornuser[0].email}
                                  </Typography>
                                  <Typography>
                                    Phone: {cornuser[0].phone}
                                  </Typography>
                                </Paper>
                              </Grid>
                            </Grid>
                          )}

                          {teamMembers.length > 0 && (
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
                                {teamMembers.map((member, index) => (
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
                                      <Typography>
                                        Name: {member.name}
                                      </Typography>
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
                <Container maxWidth="100%">
                  <div>
                    <p style={{ textAlign: "justify" }}>
                      {/* Hybrid selection is a critical step in crop management. It
                      involves choosing the most suitable hybrid varieties for
                      your farming conditions and goals. */}
                      The 2025 STEP corn contest will offer the Pioneer
                      P2042VYHR hybrid as a default hybrid. The participating
                      teams are allowed to bring their Hybrid. In case the
                      participating team selects their hybrid, they will be
                      responsible for supplying the seed by - March 13th, 2025.
                    </p>

                    <HybridForm />
                  </div>
                </Container>
              )}
              {selectedTab === 2 && (
                <Container component="main" maxWidth="90%">
                  <div>
                    <p style={{ textAlign: "justify" }}>
                      {/* Choose any plant population (seeding rate per acre)
                      between 26K and 36K, in increments of 2K. */}
                      The 2025 STEP corn contest offer only one seeding rate.
                      All the plots will be planted at 32,000 seeds per acres
                      seeding rate.
                    </p>
                    <SeedingRateForm />
                  </div>
                </Container>
              )}
              {selectedTab === 3 && (
                <Container maxWidth="100%">
                  <div style={{ textAlign: "justify" }}>
                    <p style={{ textAlign: "justify" }}>
                      All the plots will receive 13 gals/ac (30 lbs/ac of N) of
                      startup fertilizer (23-9-0) at the time of planting. You
                      can choose in-season fertilizer applications of dry
                      ammonium nitrate (30-0-0-7) and UAN 28% (28-0-0-5), or a
                      controlled release fertilizer program.
                    </p>

                    <NitrogenManagementForm />
                  </div>
                </Container>
              )}
              {selectedTab === 4 && (
                <Container component="main" maxWidth="90%">
                  <div>
                    <IrrigationManagementForm />
                  </div>
                </Container>
              )}
              {selectedTab === 5 && (
                <Container component="main" maxWidth="90%">
                  <div>
                    <p style={{ textAlign: "justify" }}>
                      You can choose a crop insurance plan and coverage level.
                      Options include Yield Protection and Revenue Protection
                      plans at coverage levels ranging from 50% to 85%. Yield
                      Protection insures against low yields relative to a
                      producer’s historic yields. Revenue Protection insures
                      against low yields and low harvest price relative to
                      projected price.
                    </p>

                    <p style={{ textAlign: "justify" }}>
                      Insurance selection must be made by March 20th. If you do
                      not choose a plan, Yield Protection at the 50% level will
                      be the default. Once your insurance choice has been
                      submitted, it cannot be changed for this year’s contest.
                    </p>

                    <p>
                      To assist with your decision, please see the Insurance
                      Premiums document and the Crop Insurance Calculator
                      available on this website.
                    </p>

                    <p>Please choose a plan and coverage level below</p>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      <div style={{ flex: 3, minWidth: "400px" }}>
                        <InsuranceSelectionForm />
                      </div>

                      <div
                        style={{
                          flex: 1,
                          border: "1px solid #ccc",
                          padding: "20px", // Increased padding for better spacing
                          maxHeight: "400px",
                          overflow: "auto",
                          minWidth: "300px",
                          backgroundImage: `url(${cornImage})`, // Assuming 'cornImage' is a variable holding the image URL
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "5px", // Added rounded corners for a softer look
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
                          List of Latest Insurance Files:
                        </h3>

                        {insuranceLatest.filter(
                          (fileName) =>
                            fileName !== "metadata.json" &&
                            fileName !== "profile.jpg"
                        ).length > 0 ? (
                          insuranceLatest
                            .filter(
                              (fileName) =>
                                fileName !== "metadata.json" &&
                                fileName !== "profile.jpg"
                            )
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
                                <p style={{ margin: "0 0 10px 0" }}>
                                  File Name: {fileName.originalFileName}
                                </p>
                                <p style={{ margin: "0 0 10px 0" }}>
                                  Upload Date:{" "}
                                  {new Date(
                                    fileName.uploadDate
                                  ).toLocaleDateString()}
                                </p>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadInsuranceFile/${fileName.originalFileName}`
                                    )
                                  }
                                  // href={`/api/downloadInsuranceFile/${fileName.originalFileName}`}
                                  // download
                                >
                                  Download
                                </Button>
                              </div>
                            ))
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
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Container>
              )}
              {selectedTab === 6 && (
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
                          Select the type of contract and quantity of bushels
                          below, then click Add Option. Contract quantities must
                          be between 20,000 and 200,000 bushels (in
                          20,000-bushel increments). You may contract multiple
                          times on different dates. The contract price will be
                          the CBOT September Futures closing price on the
                          relevant date plus a local basis posted for the STEP
                          contest. The maximum number of total bushels you may
                          contract for the season is 200,000.
                        </p>

                        <ul style={{ textAlign: "justify" }}>
                          <li>
                            For a flat-price contract, select that contract type
                            and the quantity of bushels to contract, then click
                            Add Option. The contract price will be the CBOT
                            September Futures closing price on the date you
                            select the contract plus the local basis posted for
                            that week for the STEP competition.
                          </li>
                          <li>
                            For a basis contract, initiate the contract by
                            selecting that contract type and the quantity of
                            bushels, then click Add Option. That will lock in
                            the local basis posted for that week for the STEP
                            competition. Then you must decide when to complete
                            the contract. To complete the contract, go to your
                            contract list (below Add Option) and click on the X
                            button below Status. That will lock in the CBOT
                            September Futures price on that date.
                          </li>
                        </ul>

                        <p>
                          Any uncontracted bushels from your simulated
                          1,000-acre harvest will be sold at the average spot
                          price during the week of harvest.
                        </p>
                        <p>
                          If you contract more bushels than your simulated
                          1,000-acre harvest yields, you will be charged a
                          $0.20/bushel handling fee, plus the difference between
                          the harvest spot price and highest contract price (if
                          the spot price is higher), on the number of bushels
                          over-contracted.
                        </p>
                        <p>
                          A weighted average price will be calculated for each
                          team based on both their contracted and spot sales.
                          The weighted average price will be used to calculate
                          each team’s crop sales revenue and gross profit.
                        </p>
                      </div>
                      <p style={{ textAlign: "justify" }}></p>

                      <div
                        style={{
                          flex: 1,
                          border: "1px solid #ccc",
                          padding: "20px", // Increased padding for better spacing
                          maxHeight: "400px",
                          overflow: "auto",
                          minWidth: "250px",
                          backgroundImage: `url(${cornImage})`, // Ensure 'cornImage' is the correct variable for the image URL
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          borderRadius: "5px", // Added rounded corners
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
                          List of Latest Marketing Files:
                        </h3>

                        {marketingLatest.filter(
                          (fileName) =>
                            fileName !== "metadata.json" &&
                            fileName !== "profile.jpg"
                        ).length > 0 ? (
                          marketingLatest
                            .filter(
                              (fileName) =>
                                fileName !== "metadata.json" &&
                                fileName !== "profile.jpg"
                            )
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
                                <p style={{ margin: "0 0 10px 0" }}>
                                  File Name: {fileName.originalFileName}
                                </p>
                                <p style={{ margin: "0 0 10px 0" }}>
                                  Upload Date:{" "}
                                  {new Date(
                                    fileName.uploadDate
                                  ).toLocaleDateString()}
                                </p>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadMarketingFile/${fileName.originalFileName}`
                                    )
                                  }
                                  // href={`/api/downloadMarketingFile/${fileName.originalFileName}`}
                                  // download
                                >
                                  Download
                                </Button>
                              </div>
                            ))
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
                          </p>
                        )}
                      </div>
                    </div>
                    <MarketingOptionsForm />
                  </div>
                </Container>
              )}
              {selectedTab === 7 && (
                <Container component="main" maxWidth="90%">
                  <p style={{ textAlign: "justify" }}></p>
                  {/* <div>
                    <h3>List of Files in Uploads Folder:</h3>
                    <ul>
                      {files.map((fileName, index) => (
                        <li key={index}>
                          {fileName}{" "}
                          <a
                            href={`/api/downloadFile/${fileName}`}
                            download
                          >
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                  <CornBulletin />
                </Container>
              )}
              {selectedTab === 8 && (
                <Container component="main" maxWidth="90%">
                  <RainfallChart stationId="170" />
                </Container>
              )}
            </Container>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Welcome;
