import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  Container,
  List,
  Link,
  ListItemText,
  ListItem,
  Card, // Import Card from Material-UI
  CardContent,
  CircularProgress,
} from "@mui/material";
import { saveAs } from "file-saver";

function CornBulletin() {
  const [defaultfiles, setDefaultFiles] = useState([]);
  const [insurancefiles, setInsuranceFiles] = useState([]);
  const [marketingfiles, setMarketingFiles] = useState([]);
  const [teamfiles, setTeamFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState({});

  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

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
        console.error("Error downloading file:", error);
      })
      .finally(() => {
        setLoadingDownload((prev) => ({ ...prev, [fileName]: false }));
      });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`/api/listTeamFiles/${teamName}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setTeamFiles(response.data.files);
      } catch (error) {
        console.error("Error fetching files:", error);
        // Handle error appropriately
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listdefaultFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDefaultFiles(response.data.files);
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
      .get("/api/listInsuranceFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setInsuranceFiles(response.data.files);
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
          setMarketingFiles(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);
  return (
    // <div>
    //   <h3>List of Files in Uploads Folder:</h3>
    //   <ul>
    //     {files.map((fileName, index) => (
    //       <li key={index}>
    //         {fileName}{" "}
    //         <a
    //           href={`/api/downloadFile/${fileName}`}
    //           download
    //         >
    //           Download
    //         </a>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div
      style={{
        backgroundImage:
          "url('https://step.ifas.ufl.edu/media/stepifasufledu/images/banner-photos/Coverpage-Photo-3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <Container maxWidth="xl">
        <Paper elevation={3} style={{ padding: "30px" }}>
          <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: "30px" }}>
            List of Files in Uploads Folder
          </Typography>

          <Grid container spacing={3}>
            {/* General Files Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom style={{ borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                General Files
              </Typography>
              <List>
                {defaultfiles
                  .filter((fileName) => fileName !== "metadata.json")
                  .filter((fileName) => fileName !== "profile.jpg")
                  .filter((fileName) => fileName !== "Thumbs.db")
                  .map((fileName, index) => (
                    <ListItem key={index} style={{ padding: "8px 0", display: "flex", alignItems: "flex-start" }}>
                      <ListItemText 
                        primary={fileName} 
                        primaryTypographyProps={{ 
                          style: { 
                            fontSize: "0.9rem"
                          } 
                        }}
                        style={{ flex: 1, marginRight: "10px", minWidth: 0 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!!loadingDownload[fileName]}
                        onClick={() =>
                          handleDownload(`downloadDefaultFile/${fileName}`)
                        }
                        style={{ minWidth: "90px", maxWidth: "90px", flexShrink: 0 }}
                      >
                        {loadingDownload[fileName] ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Grid>

            {/* Insurance Files Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom style={{ borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                Insurance Files
              </Typography>
              <List>
                {insurancefiles
                  .filter((fileName) => fileName !== "metadata.json")
                  .filter((fileName) => !fileName.startsWith("profile."))
                  .filter((fileName) => fileName !== "Thumbs.db")
                  .map((fileName, index) => (
                    <ListItem key={index} style={{ padding: "8px 0", display: "flex", alignItems: "flex-start" }}>
                      <ListItemText 
                        primary={fileName} 
                        primaryTypographyProps={{ 
                          style: { 
                            fontSize: "0.9rem"
                          } 
                        }}
                        style={{ flex: 1, marginRight: "10px", minWidth: 0 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!!loadingDownload[fileName]}
                        onClick={() =>
                          handleDownload(`downloadInsuranceFile/${fileName}`)
                        }
                        style={{ minWidth: "90px", maxWidth: "90px", flexShrink: 0 }}
                      >
                        {loadingDownload[fileName] ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Grid>

            {/* Marketing Files Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom style={{ borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                Marketing Files
              </Typography>
              <List>
                {marketingfiles
                  .filter((fileName) => fileName !== "metadata.json")
                  .filter((fileName) => fileName !== "profile.jpg")
                  .filter((fileName) => fileName !== "Thumbs.db")
                  .map((fileName, index) => (
                    <ListItem key={index} style={{ padding: "8px 0", display: "flex", alignItems: "flex-start" }}>
                      <ListItemText 
                        primary={fileName} 
                        primaryTypographyProps={{ 
                          style: { 
                            fontSize: "0.9rem"
                          } 
                        }}
                        style={{ flex: 1, marginRight: "10px", minWidth: 0 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!!loadingDownload[fileName]}
                        onClick={() =>
                          handleDownload(`downloadMarketingFile/${fileName}`)
                        }
                        style={{ minWidth: "90px", maxWidth: "90px", flexShrink: 0 }}
                      >
                        {loadingDownload[fileName] ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Grid>

            {/* Team Files Column */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom style={{ borderBottom: "2px solid #1976d2", paddingBottom: "10px" }}>
                Team Files
              </Typography>
              <List>
                {teamfiles
                  .filter((fileName) => !fileName.startsWith("profile."))
                  .filter((fileName) => fileName !== "metadata.json")
                  .filter((fileName) => fileName !== "Thumbs.db")
                  .map((fileName, index) => (
                    <ListItem key={index} style={{ padding: "8px 0", display: "flex", alignItems: "flex-start" }}>
                      <ListItemText 
                        primary={fileName} 
                        primaryTypographyProps={{ 
                          style: { 
                            fontSize: "0.9rem"
                          } 
                        }}
                        style={{ flex: 1, marginRight: "10px", minWidth: 0 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!!loadingDownload[fileName]}
                        onClick={() =>
                          handleDownload(`downloadTeamFile/${fileName}`)
                        }
                        style={{ minWidth: "90px", maxWidth: "90px", flexShrink: 0 }}
                      >
                        {loadingDownload[fileName] ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </ListItem>
                  ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
}
export default CornBulletin;
