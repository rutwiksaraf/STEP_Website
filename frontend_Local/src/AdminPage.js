// AdminPage.js - Super Admin Component
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { TabPanel, a11yProps } from "./TabPanel";
import axios from "axios";
import { saveAs } from "file-saver";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminList from "./AdminList";
import CottonAdminPage from "./CottonAdminPage";
import CornAdminPage from "./CornAdminPage";
import { useNavigate } from "react-router-dom";
import ContractPrices from "./ContractPrices";

function AdminPage() {
  const [showMarketingPrices, setShowMarketingPrices] = useState(false);
  const [value, setValue] = useState(0); // Tab index for Corn/Cotton
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [showFileManagement, setShowFileManagement] = useState(false);

  // File management states
  const [defaultfiles, setDefaultFiles] = useState([]);
  const [insurancefiles, setInsuranceFiles] = useState([]);
  const [marketingfiles, setMarketingFiles] = useState([]);
  const [cottondefaultfiles, setCottonDefaultFiles] = useState([]);
  const [cottoninsurancefiles, setCottonInsuranceFiles] = useState([]);
  const [cottonmarketingfiles, setCottonMarketingFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilei, setSelectedFilei] = useState(null);
  const [selectedFilem, setSelectedFilem] = useState(null);
  const [selectedFiled, setSelectedFiled] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState({});

  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  const handleCloseAdminPage = () => {
    setShowAdminPage(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleMarketingPricesClick = () => {
    setShowMarketingPrices(true);
  };

  const handleAdminRegistration = () => {
    setShowAdminPage(!showAdminPage);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseContractPrices = () => {
    setShowMarketingPrices(false);
  };

  const handleManageFiles = () => {
    setShowFileManagement(true);
    // Fetch files when opening file management
    if (value === 0) {
      fetchCornFiles();
    } else {
      fetchCottonFiles();
    }
  };

  const handleCloseFileManagement = () => {
    setShowFileManagement(false);
  };

  // File handlers
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleMarketingFileChange = (event) => {
    setSelectedFilem(event.target.files[0]);
  };

  const handleInsuranceFileChange = (event) => {
    setSelectedFilei(event.target.files[0]);
  };

  const handleDefaultFileChange = (event) => {
    setSelectedFiled(event.target.files[0]);
  };

  const handleDownload = (filePath) => {
    const fileName = decodeURIComponent(filePath.split("/").pop());
    setLoadingDownload((prev) => ({ ...prev, [fileName]: true }));

    axios
      .get(`/api/${filePath}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let resolvedFileName = fileName;
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="([^"]+)"/);
          if (matches?.length === 2) {
            resolvedFileName = matches[1];
          }
        }
        saveAs(new Blob([response.data]), resolvedFileName);
      })
      .catch((error) => {
        console.error("Download error:", error);
      })
      .finally(() => {
        setLoadingDownload((prev) => ({ ...prev, [fileName]: false }));
      });
  };

  // Fetch Corn files
  const fetchCornFiles = () => {
    axios.get("/api/listdefaultFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setDefaultFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });

    axios.get("/api/listInsuranceFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setInsuranceFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });

    axios.get("/api/listMarketingFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setMarketingFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });
  };

  // Fetch Cotton files
  const fetchCottonFiles = () => {
    axios.get("/api/listCottonDefaultFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setCottonDefaultFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });

    axios.get("/api/listCottonInsuranceFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setCottonInsuranceFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });

    axios.get("/api/listCottonMarketingFiles", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        setCottonMarketingFiles(response.data.files);
      }
    }).catch((error) => {
      console.error("Error fetching files:", error);
    });
  };

  // Upload handlers for Corn
  const handleInsuranceFileUpload = () => {
    if (!selectedFilei) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFilei);

    axios.post("/api/uploadInsurance", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("Insurance file uploaded successfully");
      document.getElementById("insuranceFileInput").value = "";
      setSelectedFilei(null);
      fetchCornFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  const handleMarketingOptionsFileUpload = () => {
    if (!selectedFilem) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFilem);

    axios.post("/api/uploadMarketingOptions", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("Marketing file uploaded successfully");
      document.getElementById("marketingOptionsFileInput").value = "";
      setSelectedFilem(null);
      fetchCornFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  const handlecorndefaultFileUpload = () => {
    if (!selectedFiled) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFiled);

    axios.post("/api/uploadDefault", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("General file uploaded successfully");
      document.getElementById("defaultFileInput").value = "";
      setSelectedFiled(null);
      fetchCornFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  // Upload handlers for Cotton
  const handleCottonInsuranceFileUpload = () => {
    const fileInput = document.getElementById("insuranceFileInput1");
    const file = fileInput?.files[0];
    
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios.post("/api/uploadCottonInsurance", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("Insurance file uploaded successfully");
      fileInput.value = "";
      fetchCottonFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  const handleCottonMarketingOptionsFileUpload = () => {
    const fileInput = document.getElementById("marketingOptionsFileInput1");
    const file = fileInput?.files[0];
    
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios.post("/api/uploadCottonMarketingOptions", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("Marketing file uploaded successfully");
      fileInput.value = "";
      fetchCottonFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  const handledefaultFileUpload = () => {
    const fileInput = document.getElementById("defaultCottonFileInput");
    const file = fileInput?.files[0];
    
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios.post("/api/uploadDefaultCotton", formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      alert("General file uploaded successfully");
      fileInput.value = "";
      fetchCottonFiles();
    }).catch((error) => {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    });
  };

  // Delete handlers for Corn
  const handleinsuranceDelete = (fileName) => {
    axios.delete(`/api/deleteinsuranceFile/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCornFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  const handlemarketingDelete = (fileName) => {
    axios.delete(`/api/deletemarketingFile/${encodeURIComponent(fileName)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCornFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  const handledefaultDelete = (fileName) => {
    axios.delete(`/api/deletedefaultFile/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCornFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  // Delete handlers for Cotton
  const handlecottoninsuranceDelete = (fileName) => {
    axios.delete(`/api/deletecottoninsuranceFile/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCottonFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  const handlecottonmarketingDelete = (fileName) => {
    axios.delete(`/api/deletecottonmarketingFile/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCottonFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  const handlecottondefaultDelete = (fileName) => {
    axios.delete(`/api/deletecottondefaultFile/${fileName}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 200) {
        alert("File deleted successfully");
        fetchCottonFiles();
      }
    }).catch((error) => {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    });
  };

  // Show Admin Registration/List page
  if (showAdminPage) {
    return (
      <div>
        <AdminRegistrationForm onClose={handleCloseAdminPage} />
        <AdminList />
      </div>
    );
  }

  // Show Marketing Prices page
  if (showMarketingPrices) {
    return (
      <div style={{ marginLeft: "20px" }}>
        <Button onClick={handleCloseContractPrices}>Back to Main Page</Button>
        <ContractPrices />
      </div>
    );
  }

  // Show File Management page
  if (showFileManagement) {
    return (
      <div style={{ padding: "20px" }}>
        <Button onClick={handleCloseFileManagement} variant="contained" style={{ marginBottom: "20px" }}>
          Back to Main Page
        </Button>
        <Typography variant="h4" component="h2" gutterBottom>
          {value === 0 ? "Corn" : "Cotton"} Files Management
        </Typography>
        
        {value === 0 ? (
          // Corn Files Management
          <div>
            <div id="uploadStatus"></div>
            <Box ml={2}>
              <h5>Insurance Selection</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file that contains details for teams to check insurance options
              </p>
              <input
                type="file"
                id="insuranceFileInput"
                onChange={handleInsuranceFileChange}
              />
              <button onClick={handleInsuranceFileUpload}>Upload Insurance</button>
            </Box>
            <Box ml={2}>
              <h5>Marketing Options</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file that contains details for teams to check marketing options
              </p>
              <input
                type="file"
                id="marketingOptionsFileInput"
                onChange={handleMarketingFileChange}
              />
              <button onClick={handleMarketingOptionsFileUpload}>Upload Marketing Options</button>
            </Box>
            <Box ml={2}>
              <h5>General Files</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file to upload for all teams
              </p>
              <input
                type="file"
                id="defaultFileInput"
                onChange={handleDefaultFileChange}
              />
              <button onClick={handlecorndefaultFileUpload}>Upload Default File</button>
            </Box>
            <Container>
              <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom>Corn Files</Typography>
                <Typography variant="h6" gutterBottom>Default Files:</Typography>
                <List>
                  {defaultfiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadDefaultFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handledefaultDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
                <Typography variant="h6" gutterBottom>Insurance Files:</Typography>
                <List>
                  {insurancefiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadInsuranceFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handleinsuranceDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
                <Typography variant="h6" gutterBottom>Marketing Files:</Typography>
                <List>
                  {marketingfiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadMarketingFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handlemarketingDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Container>
          </div>
        ) : (
          // Cotton Files Management
          <div>
            <div id="uploadStatus"></div>
            <Box ml={2}>
              <h5>Insurance Selection</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file that contains details for teams to check insurance options
              </p>
              <input type="file" id="insuranceFileInput1" />
              <button onClick={handleCottonInsuranceFileUpload}>Upload Insurance</button>
            </Box>
            <Box ml={2}>
              <h5>Marketing Options</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file that contains details for teams to check marketing options
              </p>
              <input type="file" id="marketingOptionsFileInput1" />
              <button onClick={handleCottonMarketingOptionsFileUpload}>Upload Marketing Options</button>
            </Box>
            <Box ml={2}>
              <h5>General Files</h5>
              <p style={{ textAlign: "justify" }}>
                Choose a file to upload for all teams
              </p>
              <input type="file" id="defaultCottonFileInput" />
              <button onClick={handledefaultFileUpload}>Upload Default File</button>
            </Box>
            <Container>
              <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
                <Typography variant="h5" gutterBottom>Cotton Files</Typography>
                <Typography variant="h6" gutterBottom>Default Files:</Typography>
                <List>
                  {cottondefaultfiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadDefaultCottonFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handlecottondefaultDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
                <Typography variant="h6" gutterBottom>Insurance Files:</Typography>
                <List>
                  {cottoninsurancefiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadInsuranceCottonFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handlecottoninsuranceDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
                <Typography variant="h6" gutterBottom>Marketing Files:</Typography>
                <List>
                  {cottonmarketingfiles
                    .filter((fileName) => fileName !== "metadata.json" && fileName !== "Thumbs.db")
                    .map((fileName, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={fileName} />
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!!loadingDownload[fileName]}
                          onClick={() => handleDownload(`downloadMarketingCottonFile/${fileName}`)}
                        >
                          {loadingDownload[fileName] ? <CircularProgress size={20} color="inherit" /> : "Download"}
                        </Button>
                        <Button onClick={() => handlecottonmarketingDelete(fileName)}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Container>
          </div>
        )}
      </div>
    );
  }

  // Main Super Admin Dashboard
  return (
    <div>
      <AppBar position="static" color="default">
        <Paper elevation={3}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Admin Tabs"
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab label="Corn" {...a11yProps(0)} />
            <Tab label="Cotton" {...a11yProps(1)} />
          </Tabs>
        </Paper>
      </AppBar>

      <Paper
        elevation={2}
        style={{
          padding: 20,
          margin: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome Super Admin!
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdminRegistration}
            style={{ marginRight: 10 }}
          >
            Manage Admins
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
            onClick={handleMarketingPricesClick}
          >
            Marketing Prices
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleManageFiles}
            style={{ marginRight: 10 }}
          >
            Manage Files
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Paper>

      <TabPanel value={value} index={0}>
        <CornAdminPage showSuperAdminFeatures={true} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CottonAdminPage showSuperAdminFeatures={true} />
      </TabPanel>
    </div>
  );
}

export default AdminPage;
