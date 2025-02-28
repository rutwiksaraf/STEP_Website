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
  CardContent, // Import CardContent from Material-UI
} from "@mui/material";
import { saveAs } from "file-saver";

function CottonBulletin() {
  const [defaultfiles, setDefaultFiles] = useState([]);
  const [insurancefiles, setInsuranceFiles] = useState([]);
  const [marketingfiles, setMarketingFiles] = useState([]);
  const [teamfiles, setTeamFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [cottonteamfiles, setCottonTeamFiles] = useState([]);
  const teamName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

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
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `/api/listCottonTeamFiles/${teamName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );
        setCottonTeamFiles(response.data.files);
        console.log(response.data.files);
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
      .get("/api/listcottonFiles", {
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

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listCottondefaultFiles", {
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
      .get("/api/listCottonInsuranceFiles", {
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
      .get("/api/listCottonMarketingFiles", {
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
        height: "100vh", // This sets the minimum height to 100% of the viewport height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // This centers the form vertically
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            List of Files in Uploads Folder:
          </Typography>

          <Typography variant="h6" gutterBottom>
            General Files:
          </Typography>
          <List>
            {defaultfiles
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => fileName !== "profile.jpg")
              .filter((fileName) => fileName !== "Thumbs.db")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleDownload(`downloadDefaultCottonFile/${fileName}`)
                    }
                    // href={`/api/downloadDefaultFile/${fileName}`}
                    // download
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
          </List>
          <Typography variant="h6" gutterBottom>
            Insurance Files:
          </Typography>
          <List>
            {insurancefiles
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => !fileName.startsWith("profile."))
              .filter((fileName) => fileName !== "Thumbs.db")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      handleDownload(`downloadInsuranceCottonFile/${fileName}`)
                    }
                    // href={`/api/downloadInsuranceFile/${fileName}`}
                    // download
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
          </List>
          <Typography variant="h6" gutterBottom>
            Marketing Files:
          </Typography>
          <List>
            {marketingfiles
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => fileName !== "profile.jpg")
              .filter((fileName) => fileName !== "Thumbs.db")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    // href={`/api/downloadMarketingFile/${fileName}`}
                    // download
                    onClick={() =>
                      handleDownload(`downloadMarketingCottonFile/${fileName}`)
                    }
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
          </List>
          <Typography variant="h6" gutterBottom>
            Team Files:
          </Typography>
          <List>
            {cottonteamfiles
              .filter((fileName) => !fileName.startsWith("profile."))
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => fileName !== "Thumbs.db")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    // href={`/api/downloadTeamFile/${teamName}/${fileName}`}
                    // download
                    onClick={() =>
                      handleDownload(
                        `downloadCottonTeamFile/${teamName}/${fileName}`
                      )
                    }
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
          </List>

          {/* <List>
            {files
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => fileName !== "profile.jpg")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Link href={`/api/downloadCottonFile/${fileName}`} download>
                    Download
                  </Link>
                </ListItem>
              ))}
          </List>
          <List>
            {cottonteamfiles
              .filter((fileName) => fileName !== "metadata.json")
              .filter((fileName) => fileName !== "profile.jpg")
              .map((fileName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={fileName} />
                  <Link
                    href={`/api/downloadCottonTeamFile/${teamName}/${fileName}`}
                    download
                  >
                    Download
                  </Link>
                </ListItem>
              ))}
          </List> */}
        </Paper>
      </Container>
    </div>
  );
}
export default CottonBulletin;
