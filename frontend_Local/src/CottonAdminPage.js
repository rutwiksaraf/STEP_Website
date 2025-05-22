import React, { useState, useEffect } from "react";
import {
  AppBar,
  RadioGroup,
  Tabs,
  Tab,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemButton,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Container,
  Link,
  Button,
  selectClasses,
} from "@mui/material";
import { TabPanel, a11yProps } from "./TabPanel"; // You need to define TabPanel and a11yProps
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminList from "./AdminList";
// import CottonAdminPage from "./CottonAdminPage";
// import CornAdminPage from "./CornAdminPage";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { saveAs } from "file-saver";
import profileImg from "./profile.jpg";

function CottonAdminPage() {
  const [value, setValue] = useState(1);
  const [value1, setValue1] = useState(0);
  const [cornUsers, setCornUsers] = useState([]);
  const [cottonUsers, setCottonUsers] = useState([]); // Change to cottonUsers
  const [selectedUser, setSelectedUser] = useState(null);
  const [submittedHybridForms, setSubmittedHybridForms] = useState([]);
  const [submittedCottonHybridForms, setSubmittedCottonHybridForms] = useState(
    []
  );
  const [seedingsubmittedForms, setseedingSubmittedForms] = useState([]);
  const [seedingcottonsubmittedForms, setseedingcottonSubmittedForms] =
    useState([]);
  const [NitrogentableData, setNitrogenTableData] = useState([]);
  const [NitrogenCottontableData, setNitrogenCottonTableData] = useState([]);
  const [Irrigationapplications, setIrrigationApplications] = useState([]);
  const [IrrigationCottonapplications, setIrrigationCottonApplications] =
    useState([]);
  const [starterData, setStarterData] = useState([]);
  const [InsuranceFormData, setInsuranceFormData] = useState([]);
  const [InsuranceCottonFormData, setInsuranceCottonFormData] = useState([]);
  const [marketingOptions, setMarketingOptions] = useState([]);
  const [marketingCottonOptions, setMarketingCottonOptions] = useState([]);
  const [growthRegulationCotton, setGrowthRegulationCotton] = useState([]);

  const [defaultfiles, setDefaultFiles] = useState([]);
  const [insurancefiles, setInsuranceFiles] = useState([]);
  const [marketingfiles, setMarketingFiles] = useState([]);
  const [cottondefaultfiles, setCottonDefaultFiles] = useState([]);
  const [cottoninsurancefiles, setCottonInsuranceFiles] = useState([]);
  const [cottonmarketingfiles, setCottonMarketingFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [showAdminPage, setShowAdminPage] = useState(false);
  // const username = localStorage.getItem("username");
  const [showFileManagement, setShowFileManagement] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageUrl1, setProfileImageUrl1] = useState(null);
  const [cottonteamMembers, setCottonTeamMembers] = useState([]);
  const token = localStorage.getItem("token");

  let navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilei, setSelectedFilei] = useState(null);
  const [selectedFilem, setSelectedFilem] = useState(null);
  const [selectedFiled, setSelectedFiled] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [soilMoistureSensor, setSoilMoistureSensor] = useState("");
  const [isApplicationTypeConfirmed1, setIsApplicationTypeConfirmed1] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isApplicationTypeConfirmed, setIsApplicationTypeConfirmed] =
    useState(false);
  const [ApplicationType, setApplicationType] = useState("");
  const [isApplicationTypeConfirmedN, setIsApplicationTypeConfirmedN] =
    useState(false);
  const [
    isApplicationTypeConfirmedNCotton,
    setIsApplicationTypeConfirmedNCotton,
  ] = useState(false);
  const handleCloseAdminPage = () => {
    setShowAdminPage(false);
  };

  const handleLogout = () => {
    // Clear localStorage or sessionStorage as needed
    localStorage.clear(); // or sessionStorage.clear();

    // Redirect to the login page
    window.location.href = "/login"; // Adjust the path as needed
  };

  // Handler for file selection
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

  const handleAdminRegistration = () => {
    setShowAdminPage(!showAdminPage);
  };

  const [selectedFile1, setSelectedFile1] = useState(null);

  // Handler for file selection
  const handleFileChange1 = (event) => {
    setSelectedFile1(event.target.files[0]);
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
          fetchGrowthSubmittedForms();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
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

  const handleTeamFileDelete = (fileName, teamName) => {
    axios
      .delete(`/api/deleteTeamFile/${teamName}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handleCottonTeamFileDelete = (fileName, teamName) => {
    axios
      .delete(`/api/deleteCottonTeamFile/${teamName}/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  useEffect(() => {
    if (selectedUser) {
      generateImageUrl();

      if (value === 0) {
        fetchTeamMembers();
        fetchApplicationTypeConfirmationN();
        fetchApplicationTypeConfirmation();
        fetchApplicationTypeConfirmation1();
      } else if (value === 1) {
        fetchCottonTeamMembers();
        fetchApplicationTypeConfirmationNCotton();
        fetchApplicationTypeConfirmationCotton();
        fetchApplicationTypeConfirmation1Cotton();
      }
    }
  }, [selectedUser, value]);

  const fetchApplicationTypeConfirmationN = () => {
    setApplicationType("");
    setIsApplicationTypeConfirmedN(false);
    axios
      .get("/api/getApplicationTypeConfirmation", {
        params: { teamName: selectedUser.teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setApplicationType(response.data.applicationType);
          setIsApplicationTypeConfirmedN(response.data.isConfirmed);
        } else {
          setApplicationType("");
          setIsApplicationTypeConfirmedN(false);
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        setApplicationType("");
        setIsApplicationTypeConfirmedN(false);
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmationNCotton = () => {
    setApplicationType("");
    setIsApplicationTypeConfirmedN(false);
    axios
      .get("/api/getCottonApplicationTypeConfirmation", {
        params: { teamName: selectedUser.teamName },
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data) {
          // Assuming response.data has the structure { applicationType, isConfirmed }
          setApplicationType(response.data.applicationType);
          setIsApplicationTypeConfirmedN(response.data.isConfirmed);
        } else {
          setApplicationType("");
          setIsApplicationTypeConfirmedN(false);
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        setApplicationType("");
        setIsApplicationTypeConfirmedN(false);
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmation = () => {
    setSelectedOption("");
    setIsApplicationTypeConfirmed(false);
    axios
      .get("/api/getIrrigationApplicationTypeConfirmation", {
        params: { teamName: selectedUser.teamName },
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
          setSelectedOption("");
          setIsApplicationTypeConfirmed(false);
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        setSelectedOption("");
        setIsApplicationTypeConfirmed(false);
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmation1 = () => {
    setSoilMoistureSensor("");
    setIsApplicationTypeConfirmed1(false);
    axios
      .get("/api/getMoistureApplicationTypeConfirmation", {
        params: { teamName: selectedUser.teamName },
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
          setSoilMoistureSensor("");
          setIsApplicationTypeConfirmed1(false);
          console.error("Sensor type confirmation not found");
        }
      })
      .catch((error) => {
        setSoilMoistureSensor("");
        setIsApplicationTypeConfirmed1(false);
        console.error("Error fetching sensor type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmationCotton = () => {
    setSelectedOption("");
    setIsApplicationTypeConfirmed(false);
    axios
      .get("/api/getIrrigationApplicationTypeConfirmationCotton", {
        params: { teamName: selectedUser.teamName },
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
          setSelectedOption("");
          setIsApplicationTypeConfirmed(false);
          console.error("Application type confirmation not found");
        }
      })
      .catch((error) => {
        setSelectedOption("");
        setIsApplicationTypeConfirmed(false);
        console.error("Error fetching application type confirmation:", error);
      });
  };

  const fetchApplicationTypeConfirmation1Cotton = () => {
    setSoilMoistureSensor("");
    setIsApplicationTypeConfirmed1(false);
    axios
      .get("/api/getMoistureApplicationTypeConfirmationCotton", {
        params: { teamName: selectedUser.teamName },
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
          setSoilMoistureSensor("");
          setIsApplicationTypeConfirmed1(false);
          console.error("Sensor type confirmation not found");
        }
      })
      .catch((error) => {
        setSoilMoistureSensor("");
        setIsApplicationTypeConfirmed1(false);
        console.error("Error fetching sensor type confirmation:", error);
      });
  };

  const fetchProfileImage = () => {
    const crop = value === 0 ? "corn" : value === 1 ? "cotton" : "";
    const profileImageUrlEndpoint = `/api/getProfileImageUrl/${crop}/${selectedUser.teamName}`;

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

  // Define the function to fetch team members
  const fetchTeamMembers = async () => {
    if (selectedUser) {
      setTeamMembers([]);
      const teamId = selectedUser.id; // Assuming selectedUser.id contains the ID of the team
      axios
        .post(
          "/api/cornTeamMembers",
          {
            id: teamId, // Access the team ID from cornuser[0]
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
          setTeamMembers([]);
          console.error("Failed to fetch team members:", error);
          // Handle errors, for example, by showing an error message in the UI
        });
    }
  };

  // Call this function at the appropriate time, for example, when a team is selected
  // fetchTeamMembers();

  const generateImageUrl = () => {
    if (selectedUser) {
      // Determine the crop based on the value
      // const crop = value === 0 ? "corn" : value === 1 ? "cotton" : "";
      // const imageUrl = `/uploads/${crop}/${selectedUser.teamName}/profile.jpg`;
      // fetch(imageUrl)
      //   .then((response) => {
      //     if (response.ok) {
      //       setProfileImageUrl(imageUrl);
      //     } else {
      //       setProfileImageUrl("./profile.jpg"); // Path to your generic image
      //     }
      //   })
      //   .catch(() => {
      //     setProfileImageUrl("./profile.jpg"); // Path to your generic image
      //   });
      setProfileImageUrl(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRooEnD32-UtBw55GBfDTxxUZApMhWWnRaoLw&usqp=CAU"
      );
      fetchProfileImage();
    }
  };
  // If either selectedUser or crop is not set, return a default image URL

  // Use the generateImageUrl function to set the imageUrl
  //const imageUrl = generateImageUrl();

  // Handler for file upload
  const handleteamFileUpload = (teamName) => {
    // const selectedFile = document.getElementById("defaultFileInput1").files[0];

    // Check if a file is selected

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("teamName", teamName); // Assuming teamName is passed as a prop or from state
    formData.append("cropType", "corn"); // Assuming cropType is passed as a prop or from state

    axios
      .post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        // Handle successful upload here (e.g., clear the selection, display a message)
        const successMessage = document.createElement("div");
        successMessage.innerText = "Team file uploaded successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input
        document.getElementById("defaultFileInput1").value = "";

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle errors here (e.g., display an error message)
      });
  };

  const handleteamFileUpload1 = (teamName) => {
    // const selectedFile = document.getElementById("defaultFileInput1").files[0];

    // Check if a file is selected

    if (!selectedFile1) {
      alert("Please select a file to upload.");
      return;
    }

    const formData1 = new FormData();
    formData1.append("file", selectedFile1);
    formData1.append("teamName", teamName); // Assuming teamName is passed as a prop or from state
    formData1.append("cropType", "cotton"); // Assuming cropType is passed as a prop or from state

    axios
      .post("/api/upload", formData1, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("File uploaded successfully:", response.data);
        // Handle successful upload here (e.g., clear the selection, display a message)
        const successMessage = document.createElement("div");
        successMessage.innerText = "team file uploaded successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input
        document.getElementById("defaultFileInput2").value = "";

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        // Handle errors here (e.g., display an error message)
      });
  };

  const handleinsuranceDelete = (fileName) => {
    axios
      .delete(`/api/deleteinsuranceFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handlemarketingDelete = (fileName) => {
    axios
      .delete(`/api/deletemarketingFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handledefaultDelete = (fileName) => {
    axios
      .delete(`/api/deletedefaultFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handlecottoninsuranceDelete = (fileName) => {
    axios
      .delete(`/api/deletecottoninsuranceFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handlecottonmarketingDelete = (fileName) => {
    axios
      .delete(`/api/deletecottonmarketingFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

  const handlecottondefaultDelete = (fileName) => {
    axios
      .delete(`/api/deletecottondefaultFile/${fileName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        // Handle successful deletion
        // e.g., remove the file from the marketingfiles state
        if (response.status === 200) {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          const successMessage = document.createElement("div");
          successMessage.innerText = "file could not be deleted successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        const successMessage = document.createElement("div");
        successMessage.innerText = "file could not be deleted successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        // Handle error
        console.error("Error deleting file:", error);
      });
  };

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
          setDefaultFiles([]);
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        setDefaultFiles([]);
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/cottonfetchAllStarterData", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setStarterData(response.data);
        } else {
          setStarterData([]);
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        setStarterData([]);
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
          setInsuranceFiles([]);
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        setInsuranceFiles([]);
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
          setMarketingFiles([]);
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        setMarketingFiles([]);
        console.error("Error fetching files:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the list of files when the component mounts
    axios
      .get("/api/listCottonDefaultFiles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCottonDefaultFiles(response.data.files);
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
          setCottonInsuranceFiles(response.data.files);
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
          setCottonMarketingFiles(response.data.files);
        } else {
          console.error("Failed to fetch files from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedUser(null);
  };

  const handleChange1 = (event, newValue) => {
    setValue1(newValue);
  };

  const handleChange2 = (event, newValue) => {
    setValue1(newValue);
  };

  const [teamfiles, setTeamFiles] = useState([]);

  const fetchFiles = async (teamName) => {
    setTeamFiles([]);
    try {
      const response = await axios.get(`/api/listTeamFiles/${teamName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setTeamFiles(response.data.files);
    } catch (error) {
      setTeamFiles([]);
      console.error("Error fetching files:", error);
      // Handle error appropriately
    }
  };

  const [cottonteamfiles, setCottonTeamFiles] = useState([]);

  const fetchCottonFiles = async (teamName) => {
    try {
      setCottonTeamFiles([]);
      const response = await axios.get(`/api/listCottonTeamFiles/${teamName}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setCottonTeamFiles(response.data.files);
    } catch (error) {
      setCottonTeamFiles([]);
      console.error("Error fetching files:", error);
      // Handle error appropriately
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchFiles(user.teamName);
  };

  const handleUserClick1 = (user) => {
    setSelectedUser(user);
    fetchCottonFiles(user.teamName);
  };

  const handleDeleteNitrogenApplication = (appId) => {
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

  const handleDeleteNitrogenApplication1 = (appId) => {
    axios
      .delete(`/api/deletecottonnitrogenApplication/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          fetchNitrogenCottonDataFromBackend();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  const handleChangeApplied = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateApplied/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchIrrigationData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  const handleChangeApplied1 = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateCottonApplied/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchCottonIrrigationData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  const handleNitrogenChangeApplied = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateNitrogenApplied/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchDataFromBackend();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  const handleNitrogenChangeApplied1 = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateCottonNitrogenApplied/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchNitrogenCottonDataFromBackend();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  const handleGrowthChangeApplied = (appId) => {
    // Make a POST request to your Express.js route to update the "applied" field
    axios
      .post(
        `/api/updateCottonGrowthApplied/${appId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchGrowthSubmittedForms();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error("Error updating applied field:", error);
      });
  };

  useEffect(() => {
    // Fetch the submitted hybrid forms data from your server
    // You can make an Axios GET request to your API endpoint
    axios
      .get("/api/getAllCottonSubmittedHybridForms", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setSubmittedCottonHybridForms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching submitted hybrid forms data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the submitted forms data for the logged-in user
    const fetchcornSeedingSubmittedForms = async () => {
      try {
        const response = await axios.get(
          "/api/getAllCornseedingForms",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
          // Send username as part of the request body
        );

        if (response.status === 200) {
          // Update the state with the fetched data
          setseedingSubmittedForms(response.data);
        } else {
          console.error("Failed to fetch submitted forms data");
        }
      } catch (error) {
        console.error("Error fetching submitted forms data:", error);
      }
    };

    //Call the fetch function when the component mounts
    fetchcornSeedingSubmittedForms();
  }, []);

  const fetchGrowthSubmittedForms = async () => {
    axios
      .get("/api/cottonFetchAllGrowthRegulation", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setGrowthRegulationCotton(response.data);
        } else {
          console.error(
            "Failed to fetch growth regulation data from the backend"
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching submitted hybrid forms data:", error);
      });
  };

  useEffect(() => {
    // Fetch the submitted hybrid forms data from your server
    // You can make an Axios GET request to your API endpoint

    fetchGrowthSubmittedForms();
  }, []);

  function handleCottonInsuranceFileUpload() {
    // Get the selected insurance file from the file input
    const insuranceFile = document.getElementById("insuranceFileInput1")
      .files[0];

    // Check if a file is selected
    if (!insuranceFile) {
      alert("Please select an insurance file.");
      return;
    }

    // Create a FormData object to send the insurance file
    const insuranceFormData = new FormData();
    insuranceFormData.append("insuranceFile", insuranceFile);

    // Send a POST request to upload the insurance file
    axios
      .post("/api/uploadCottonInsuranceFile", insuranceFormData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("Insurance file uploaded successfully");
        const successMessage = document.createElement("div");
        successMessage.innerText = "Insurance file uploaded successfully";
        document.getElementById("uploadStatus").appendChild(successMessage);

        // Remove the selected file from the input
        document.getElementById("insuranceFileInput").value = "";

        // Remove the success message after 3 seconds (3000 milliseconds)
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error uploading insurance file:", error);
      });
  }

  // Function to handle marketing options file upload
  function handleCottonMarketingOptionsFileUpload() {
    // Get the selected marketing options file from the file input
    const marketingOptionsFile = document.getElementById(
      "marketingOptionsFileInput1"
    ).files[0];

    // Check if a file is selected
    if (!marketingOptionsFile) {
      alert("Please select a marketing options file.");
      return;
    }

    // Create a FormData object to send the marketing options file
    const marketingOptionsFormData = new FormData();
    marketingOptionsFormData.append(
      "marketingOptionsFile",
      marketingOptionsFile
    );

    // Send a POST request to upload the marketing options file
    axios
      .post("/api/uploadCottonMarketingOptionsFile", marketingOptionsFormData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Cotton Marketing options file uploaded successfully");
          const successMessage = document.createElement("div");
          successMessage.innerText =
            "Marketing options file uploaded successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input
          document.getElementById("marketingOptionsFileInput").value = "";

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          console.error("Error uploading marketing options file");
        }
      })
      .catch((error) => {
        console.error("Error uploading marketing options file:", error);
      });
  }

  // Function to handle marketing options file upload
  function handledefaultFileUpload() {
    // Get the selected marketing options file from the file input
    const cottondefaultFile = document.getElementById("defaultCottonFileInput")
      .files[0];

    // Check if a file is selected
    if (!cottondefaultFile) {
      alert("Please select a general file.");
      return;
    }

    // Create a FormData object to send the marketing options file
    const defaultData = new FormData();
    defaultData.append("cottondefaultFile", cottondefaultFile);

    // Send a POST request to upload the marketing options file
    axios
      .post("/api/uploadCottonDefaultFile", defaultData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("cotton default file uploaded successfully");
          const successMessage = document.createElement("div");
          successMessage.innerText = "default file uploaded successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input
          document.getElementById("defaultCottonFileInput").value = "";

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          console.error("Error uploading cotton default file");
        }
      })
      .catch((error) => {
        console.error("Error uploading cotton default file:", error);
      });
  }

  function handlecorndefaultFileUpload() {
    // Get the selected marketing options file from the file input
    // const defaultFile = document.getElementById("defaultFileInput").files[0];

    // Check if a file is selected
    if (!selectedFiled) {
      alert("Please select a general file.");
      return;
    }

    // Create a FormData object to send the marketing options file
    const defaultData = new FormData();
    defaultData.append("file", selectedFiled);

    // Send a POST request to upload the marketing options file
    axios
      .post("/api/uploadDefaultFile", defaultData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("corn default file uploaded successfully");
          const successMessage = document.createElement("div");
          successMessage.innerText = "default file uploaded successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input
          document.getElementById("defaultFileInput").value = "";

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error uploading corn default file:", error);
      });
  }

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
          // fetchData();
          fetchIrrigationData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  const handleDeleteApplication1 = (appId) => {
    axios
      .delete(`/api/deletecottonirrigationApplication/${appId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Application deleted successfully, now update the table data
          // fetchData();
          fetchCottonIrrigationData();
        } else {
          console.error("Failed to delete the application");
        }
      })
      .catch((error) => {
        console.error("Error deleting the application:", error);
      });
  };

  function handleFileUpload() {
    // Get the selected files from the file inputs
    const insuranceFile =
      document.getElementById("insuranceFileInput").files[0];
    const marketingOptionsFile = document.getElementById(
      "marketingOptionsFileInput"
    ).files[0];

    // Check if files are selected
    if (!insuranceFile || !marketingOptionsFile) {
      alert("Please select both insurance and marketing options files.");
      return;
    }

    // Create FormData objects to send the files
    const insuranceFormData = new FormData();
    insuranceFormData.append("insuranceFile", insuranceFile);

    const marketingOptionsFormData = new FormData();
    marketingOptionsFormData.append(
      "marketingOptionsFile",
      marketingOptionsFile
    );

    // Send POST requests to upload the files (you can use Axios or other libraries)
    // Example using fetch:
    fetch(
      "/api/uploadInsuranceFile",
      {
        method: "POST",
        body: insuranceFormData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Insurance file uploaded successfully");
        } else {
          console.error("Error uploading insurance file");
        }
      })
      .catch((error) => {
        console.error("Error uploading insurance file:", error);
      });

    fetch("/api/uploadMarketingOptionsFile", {
      method: "POST",
      body: marketingOptionsFormData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Marketing options file uploaded successfully");
        } else {
          console.error("Error uploading marketing options file");
        }
      })
      .catch((error) => {
        console.error("Error uploading marketing options file:", error);
      });
  }

  // Function to handle insurance file upload
  const handleInsuranceFileUpload = () => {
    // Get the selected insurance file from the file input
    // const insuranceFile =
    //   document.getElementById("insuranceFileInput").files[0];
    // Check if a file is selected
    if (!selectedFilei) {
      alert("Please select an insurance file.");
      return;
    }

    // Create a FormData object to send the insurance file
    const insuranceFormData = new FormData();
    insuranceFormData.append("file", selectedFilei);

    // Send a POST request to upload the insurance file
    axios
      .post("/api/uploadInsuranceFile", insuranceFormData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Insurance file uploaded successfully");
          const successMessage = document.createElement("div");
          successMessage.innerText = "Insurance file uploaded successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input
          document.getElementById("insuranceFileInput").value = "";

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })

      .catch((error) => {
        console.error("Error uploading insurance file:", error);
      });
  };

  // Function to handle marketing options file upload
  function handleMarketingOptionsFileUpload() {
    // Get the selected marketing options file from the file input
    // const marketingOptionsFile = document.getElementById(
    //   "marketingOptionsFileInput"
    // ).files[0];

    // Check if a file is selected
    if (!selectedFilem) {
      alert("Please select a marketing options file.");
      return;
    }

    // Create a FormData object to send the marketing options file
    const marketingOptionsFormData = new FormData();
    marketingOptionsFormData.append("file", selectedFilem);
    axios
      .post("/api/uploadMarketingOptionsFile", marketingOptionsFormData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      // Send a POST request to upload the marketing options file

      .then((response) => {
        if (response.status === 200) {
          console.log("Marketing options file uploaded successfully");
          const successMessage = document.createElement("div");
          successMessage.innerText =
            "Marketing options file uploaded successfully";
          document.getElementById("uploadStatus").appendChild(successMessage);

          // Remove the selected file from the input
          document.getElementById("marketingOptionsFileInput").value = "";

          // Remove the success message after 3 seconds (3000 milliseconds)
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        }
      })
      .catch((error) => {
        console.error("Error uploading marketing options file:", error);
      });
  }

  useEffect(() => {
    // Fetch users for the Corn crop from the API
    axios
      .get("/api/get_corn_users", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setCornUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Corn users data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch users for the Cotton crop from the API (changed to cotton)
    axios
      .get("/api/get_cotton_users", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setCottonUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Cotton users data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the submitted hybrid forms data from your server
    // You can make an Axios GET request to your API endpoint
    axios
      .get("/api/getAllCornSubmittedHybridForms", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setSubmittedHybridForms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching submitted hybrid forms data:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch the submitted forms data for the logged-in user
    const fetchcornSeedingSubmittedForms = async () => {
      try {
        const response = await axios.get(
          "/api/getAllCornseedingForms",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
          // Send username as part of the request body
        );

        if (response.status === 200) {
          // Update the state with the fetched data
          setseedingSubmittedForms(response.data);
        } else {
          console.error("Failed to fetch submitted forms data");
        }
      } catch (error) {
        console.error("Error fetching submitted forms data:", error);
      }
    };

    //Call the fetch function when the component mounts
    fetchcornSeedingSubmittedForms();
  }, []);

  useEffect(() => {
    // Fetch the submitted forms data for the logged-in user
    const fetchcottonSeedingSubmittedForms = async () => {
      try {
        const response = await axios.get(
          "/api/getAllCottonseedingForms",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
          // Send username as part of the request body
        );

        if (response.status === 200) {
          // Update the state with the fetched data
          setseedingcottonSubmittedForms(response.data);
        } else {
          console.error("Failed to fetch submitted forms data");
        }
      } catch (error) {
        console.error("Error fetching submitted forms data:", error);
      }
    };

    // Call the fetch function when the component mounts
    fetchcottonSeedingSubmittedForms();
  }, []);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchDataFromBackend();
  }, []); // Fetch data whenever applicationType changes

  const fetchDataFromBackend = () => {
    // Make an API request to fetch data from the backend based on the application type
    axios
      .get("/api/fetchAllNitrogenManagementData", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          console.log(response.data);
          setNitrogenTableData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchNitrogenCottonDataFromBackend();
  }, []);

  const fetchNitrogenCottonDataFromBackend = () => {
    // Make an API request to fetch data from the backend based on the application type
    axios
      .get("/api/cottonfetchAllNitrogenManagementData", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          console.log(response.data);
          setNitrogenCottonTableData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchIrrigationData = () => {
    axios
      .get("/api/fetchAllSoilMoistureSensorData", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          // Handle the successful response and update the state
          setIrrigationApplications(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  };

  //Call the fetchData function when the component mounts
  useEffect(() => {
    fetchIrrigationData();
  }, []);

  const fetchCottonIrrigationData = () => {
    axios
      .get("/api/cottonfetchAllSoilMoistureSensorData", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        // Handle the successful response and update the state
        setIrrigationCottonApplications(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  };

  // Call the fetchData function when the component mounts
  useEffect(() => {
    fetchCottonIrrigationData();
  }, []);

  const fetchCottonTeamMembers = async () => {
    setCottonTeamMembers([]);
    if (selectedUser && selectedUser.cropType === "cotton") {
      const teamId = selectedUser.id; // Assuming selectedUser.id contains the ID of the team
      axios
        .post(
          "/api/cottonTeamMembers",
          {
            id: teamId, // Access the team ID from cornuser[0]
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
          setCottonTeamMembers(response.data);
        })

        .catch((error) => {
          setCottonTeamMembers([]);
          console.error("Failed to fetch team members:", error);
          // Handle errors, for example, by showing an error message in the UI
        });
    }
  };

  const fetchInsuranceSelectionData = () => {
    axios
      .get("/api/getAllInsuranceSelectionForms", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setInsuranceFormData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Fetch existing insurance selection data for the user when the component mounts
  useEffect(() => {
    fetchInsuranceSelectionData();
  }, []);

  const fetchInsuranceCottonSelectionData = () => {
    axios
      .get("/api/cottongetAllInsuranceSelectionForms", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setInsuranceCottonFormData(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Fetch existing insurance selection data for the user when the component mounts
  useEffect(() => {
    fetchInsuranceCottonSelectionData();
  }, []);

  const fetchMarketingDataFromBackend = () => {
    // Make an API request to fetch data from the backend
    axios
      .get("/api/fetchAllMarketingOptions", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          setMarketingOptions(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchMarketingCottonDataFromBackend = () => {
    // Make an API request to fetch data from the backend
    axios
      .get("/api/cottonfetchAllMarketingOptions", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }) // Update the URL accordingly
      .then((response) => {
        if (response.status === 200) {
          // Set the retrieved data to the state variable
          setMarketingCottonOptions(response.data);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchMarketingCottonDataFromBackend();
  }, []);

  const tabLabels = [
    "User Info",
    "Hybrid",
    "Seeding",
    "Nitrogen Mgmnt",
    "Irrigation Mgmnt",
    "Insurance",
    "Marketing",
    "File Mgmnt",
  ];

  const tabLabelsCotton = [
    "User Info",
    "Hybrid",
    "Seeding",
    "Nitrogen Mgmnt",
    "Irrigation Mgmnt",
    "Insurance",
    "Growth Regulator",
    "Marketing",
    "File Mgmnt",
  ];

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteCottonUser = () => {
    // API call to delete the user

    const isFirstConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isFirstConfirmed) return;

    // Second confirmation
    const isSecondConfirmed = window.confirm(
      "This action is irreversible. Are you absolutely sure?"
    );
    if (!isSecondConfirmed) return;
    axios
      .delete(`/api/deleteCottonUser/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("User deleted successfully:", response);
        // Handle successful deletion (e.g., update state, show notification)
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Handle error (e.g., show error message)
        setErrorMessage("Failed to delete user.");
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      });
  };

  const handleDeleteCornUser = () => {
    // API call to delete the user
    const isFirstConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!isFirstConfirmed) return;

    // Second confirmation
    const isSecondConfirmed = window.confirm(
      "This action is irreversible. Are you absolutely sure?"
    );
    if (!isSecondConfirmed) return;
    axios
      .delete(`/api/deleteCornUser/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        console.log("User deleted successfully:", response);
        // Handle successful deletion (e.g., update state, show notification)
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        // Handle error (e.g., show error message)
        setErrorMessage("Failed to delete user.");
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      });
  };

  const handleProfileClick = () => {
    navigate("/adminprofile");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      {/* <TabPanel value={value} index={0}> */}
      <div style={{ display: "flex" }}>
        <List
          component="nav"
          aria-label="Usernames"
          style={{ minWidth: "200px" }}
        >
          <ListItem
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "Blue",
            }}
          >
            Cotton Users
          </ListItem>
          {cottonUsers.map((user, index) => (
            <ListItemButton
              button
              key={index}
              style={{
                backgroundColor: selectedUser === user ? "#fa4616" : "white",
              }}
              onClick={() => handleUserClick1(user)}
            >
              <ListItemText primary={user.teamName} />{" "}
              {/* Change to teamName */}
            </ListItemButton>
          ))}
        </List>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!selectedUser && (
            <div>
              <div id="uploadStatus"></div>
              <Box ml={2}>
                <h5>Insurance Selection</h5>
                <p style={{ textAlign: "justify" }}>
                  Choose a file that contains details for teams to check
                  insurance options
                </p>
                <input type="file" id="insuranceFileInput1" />
                <button onClick={handleCottonInsuranceFileUpload}>
                  Upload Insurance
                </button>
              </Box>
              <Box ml={2}>
                <h5>Marketing Options</h5>
                <p style={{ textAlign: "justify" }}>
                  Choose a file that contains details for teams to check
                  marketing options
                </p>
                <input type="file" id="marketingOptionsFileInput1" />
                <button onClick={handleCottonMarketingOptionsFileUpload}>
                  Upload Marketing Options
                </button>
              </Box>
              <Box ml={2}>
                <h5>General Files</h5>
                <p style={{ textAlign: "justify" }}>
                  Choose a file to upload for all teams
                </p>
                <input type="file" id="defaultCottonFileInput" />
                <button onClick={handledefaultFileUpload}>
                  Upload Default File
                </button>
              </Box>

              <p style={{ textAlign: "justify" }}></p>
            </div>
          )}
          <Box ml={2}>
            {/* Add some spacing between list and user details */}
            {selectedUser && (
              <div>
                <div>
                  <AppBar position="static" color="default">
                    <Paper elevation={3}>
                      <Tabs
                        value={value1}
                        onChange={handleChange1}
                        aria-label="Admin Tabs"
                        variant="scrollable" // Allow tabs to scroll if many tabs are present
                        indicatorColor="secondary"
                        textColor="primary"
                      >
                        {tabLabelsCotton.map((label, index) => (
                          <Tab
                            label={label}
                            {...a11yProps(index)}
                            key={index}
                          />
                        ))}
                      </Tabs>
                    </Paper>
                  </AppBar>

                  <TabPanel value={value1} index={0}>
                    <h4>User Details</h4>
                    <Avatar
                      alt="Profile Image"
                      src={profileImageUrl} // Use the dynamically generated imageUrl
                      sx={{ width: 350, height: 350 }}
                      variant="rounded"
                    />
                    {successMessage && (
                      <h2 className="success-message">{successMessage}</h2>
                    )}
                    {errorMessage && (
                      <h2 className="success-message">{errorMessage}</h2>
                    )}
                    <p style={{ textAlign: "justify" }}>
                      Username: {selectedUser.teamName}
                    </p>{" "}
                    {/* Change to teamName */}
                    <p style={{ textAlign: "justify" }}>
                      Crop: {selectedUser.cropType}
                    </p>{" "}
                    <p style={{ textAlign: "justify" }}>
                      Capitan First Name: {selectedUser.captainFirstName}
                    </p>{" "}
                    {/* Change to captainFirstName */}
                    <p style={{ textAlign: "justify" }}>
                      Capitan Last Name: {selectedUser.captainLastName}
                    </p>{" "}
                    {/* Change to captainLastName */}
                    <p style={{ textAlign: "justify" }}>
                      Address 1: {selectedUser.address1}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      Address 2: {selectedUser.address2}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      City: {selectedUser.city}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      State: {selectedUser.state}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      Zip Code: {selectedUser.zipCode}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      Country: {selectedUser.country}
                    </p>
                    <p style={{ textAlign: "justify" }}>
                      Email: {selectedUser.email}
                    </p>{" "}
                    {/* Change to email */}
                    <p style={{ textAlign: "justify" }}>
                      Phone: {selectedUser.phone}
                    </p>{" "}
                    <p style={{ textAlign: "justify" }}>
                      Password: {selectedUser.password}
                    </p>{" "}
                    {/* Change to phone */}
                    {/* Display other user details here */}
                    <div>
                      <h4>Team Members</h4>
                      {cottonteamMembers.length > 0 ? (
                        cottonteamMembers.map((member, index) => (
                          <div key={index}>
                            {/* Customize your team member display here */}
                            <p style={{ textAlign: "justify" }}>
                              Name: {member.name}
                            </p>
                            <p style={{ textAlign: "justify" }}>
                              Email: {member.email}
                            </p>
                            {/* Add more details as needed */}
                          </div>
                        ))
                      ) : (
                        <p style={{ textAlign: "justify" }}>
                          No team members details given
                        </p>
                      )}
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleDeleteCottonUser}
                    >
                      Delete User
                    </Button>
                  </TabPanel>

                  <TabPanel value={value1} index={1}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Hybrid Selection
                    </Typography>

                    {selectedUser && (
                      <div>
                        <Typography variant="h5" gutterBottom>
                          Submitted Forms
                        </Typography>
                        {submittedCottonHybridForms
                          .filter(
                            (form) => form.teamName === selectedUser.teamName
                          )
                          .map((form, index) => (
                            <Card key={index} sx={{ marginBottom: 2 }}>
                              <CardContent>
                                <Typography variant="h6">
                                  Hybrid: {form.hybrid}
                                </Typography>
                                <Typography variant="body1">
                                  Cost: ${form.cost} per bag
                                </Typography>
                                <Typography variant="body2">
                                  Notes: {form.notes}
                                </Typography>
                                <Typography variant="body2">
                                  Team Name: {form.teamName}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                    {/* Hybrid Selection content */}
                  </TabPanel>
                  <TabPanel value={value1} index={2}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Seeding Rate
                    </Typography>

                    {seedingcottonsubmittedForms.length > 0 && selectedUser && (
                      <div>
                        <Typography variant="h5" gutterBottom>
                          Submitted Forms
                        </Typography>
                        {seedingcottonsubmittedForms
                          .filter(
                            (form) => form.teamName === selectedUser.teamName
                          )
                          .map((form, index) => (
                            <Card key={index} sx={{ marginBottom: 2 }}>
                              <CardContent>
                                <Typography variant="body1">
                                  Seeding Rate: {form.seedingRate} Seeds/Acre
                                </Typography>
                                <Typography variant="body2">
                                  Method: {form.seedingMethod}
                                </Typography>
                                <Typography variant="body2">
                                  Notes: {form.notes}
                                </Typography>
                                <Typography variant="body2">
                                  Team Name: {form.teamName}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}

                    {/* Seeding Rate content */}
                  </TabPanel>
                  <TabPanel value={value1} index={3}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Nitrogen Management
                    </Typography>
                    {selectedUser && (
                      <div>
                        <div>
                          {isApplicationTypeConfirmedN && (
                            <div>
                              <p style={{ textAlign: "justify" }}>
                                Selected Application Type: {ApplicationType}
                              </p>
                              {/* Render any additional information about the sensor here */}
                            </div>
                          )}
                          {/* Other component markup */}
                        </div>
                        <Typography variant="h6" gutterBottom>
                          Starter Fertilizer Data
                        </Typography>

                        <TableContainer>
                          <Table id={`table-n2-mgmnt-inseason`} size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Starter</TableCell>
                                <TableCell>Amount</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {starterData
                                .filter(
                                  (app) =>
                                    app.teamName === selectedUser.teamName
                                )
                                .map((app, index) => (
                                  <TableRow key={app.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{app.starter}</TableCell>
                                    <TableCell>{app.amount}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Typography variant="h6" gutterBottom>
                          Application Data - In-Season
                        </Typography>

                        <TableContainer>
                          <Table id={`table-n2-mgmnt-inseason`} size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Application Date</TableCell>
                                <TableCell>Submitted Date</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Placement</TableCell>
                                <TableCell>Applied</TableCell>
                                <TableCell>
                                  <EditIcon />
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {NitrogenCottontableData.filter(
                                (app) =>
                                  app.teamName === selectedUser.teamName &&
                                  app.applicationType === "in-season"
                              ) // Filter data for the selected user and "in-season" application type
                                .sort(
                                  (a, b) => new Date(a.date) - new Date(b.date)
                                )
                                .map((app, index) => (
                                  <TableRow key={app.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                      {app.date.substring(0, 10)}
                                    </TableCell>
                                    <TableCell>
                                      {app.dateToday.substring(0, 10)}
                                    </TableCell>
                                    <TableCell>{app.amount}</TableCell>
                                    <TableCell>{app.placement}</TableCell>
                                    <TableCell>
                                      <button
                                        style={{
                                          backgroundColor:
                                            app.applied === "no"
                                              ? "red"
                                              : "green",
                                          color: "white", // Assuming you want white text for contrast
                                          border: "none", // Remove default button border styling
                                          // Add any other styling you need here
                                        }}
                                      >
                                        {app.applied === "no" ? (
                                          <HighlightOffIcon
                                            onClick={() =>
                                              handleNitrogenChangeApplied1(
                                                app.id
                                              )
                                            }
                                          />
                                        ) : (
                                          <DoneIcon />
                                        )}
                                      </button>
                                    </TableCell>
                                    <TableCell>
                                      <button
                                        style={{
                                          backgroundColor:
                                            app.applied === "no"
                                              ? "red"
                                              : "green",
                                          color: "white", // Assuming you want white text for contrast
                                          border: "none", // Remove default button border styling
                                          // Add any other styling you need here
                                        }}
                                      >
                                        {app.applied === "no" ? (
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteNitrogenApplication1(
                                                app.id
                                              )
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

                        <Typography variant="h6" gutterBottom>
                          Application Data - Controlled-Release
                        </Typography>

                        <TableContainer>
                          <Table
                            id={`table-n2-mgmnt-controlledrelease`}
                            size="small"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Application Date</TableCell>
                                <TableCell>Submitted Date</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>placement</TableCell>
                                <TableCell>Applied</TableCell>
                                <TableCell>
                                  <EditIcon />
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {NitrogenCottontableData.filter(
                                (app) =>
                                  app.teamName === selectedUser.teamName &&
                                  app.applicationType === "controlled-release"
                              ) // Filter data for the selected user and "controlled-release" application type
                                .sort(
                                  (a, b) => new Date(a.date) - new Date(b.date)
                                )
                                .map((app, index) => (
                                  <TableRow key={app.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                      {app.date.substring(0, 10)}
                                    </TableCell>
                                    <TableCell>
                                      {app.dateToday.substring(0, 10)}
                                    </TableCell>
                                    <TableCell>{app.amount}</TableCell>
                                    <TableCell>{app.placement}</TableCell>
                                    <TableCell>
                                      <button
                                        style={{
                                          backgroundColor:
                                            app.applied === "no"
                                              ? "red"
                                              : "green",
                                          color: "white", // Assuming you want white text for contrast
                                          border: "none", // Remove default button border styling
                                          // Add any other styling you need here
                                        }}
                                      >
                                        {app.applied === "no" ? (
                                          <HighlightOffIcon
                                            onClick={() =>
                                              handleNitrogenChangeApplied1(
                                                app.id
                                              )
                                            }
                                          />
                                        ) : (
                                          <DoneIcon />
                                        )}
                                      </button>
                                    </TableCell>
                                    <TableCell>
                                      <button
                                        style={{
                                          backgroundColor:
                                            app.applied === "no"
                                              ? "red"
                                              : "green",
                                          color: "white", // Assuming you want white text for contrast
                                          border: "none", // Remove default button border styling
                                          // Add any other styling you need here
                                        }}
                                      >
                                        {app.applied === "no" ? (
                                          <DeleteIcon
                                            onClick={() =>
                                              handleDeleteNitrogenApplication1(
                                                app.id
                                              )
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
                      </div>
                    )}
                  </TabPanel>
                  <TabPanel value={value1} index={4}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Irrigation Management
                    </Typography>
                    <div>
                        <div>
                          <p style={{ textAlign: "justify" }}>
                            Selected Irrigation Management option:
                            {selectedOption || "Not Selected"}
                          </p>
                        </div>
                      
                    </div>

                    <div>
                      {(
                        <div>
                          <p style={{ textAlign: "justify" }}>
                            Selected Soil Moisture Sensor: {soilMoistureSensor || "Not Selected"}
                          </p>
                          {/* Render any additional information about the sensor here */}
                        </div>
                      )}
                      {/* Other component markup */}
                    </div>

                    <Typography variant="h6" gutterBottom>
                      Calendar Based Irrigation Data
                    </Typography>
                    <TableContainer>
                      <Table
                        size="small"
                        aria-label="Irrigation Management Table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Application Date</TableCell>
                            <TableCell>Submitted Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Applied</TableCell>
                            <TableCell>
                              <EditIcon />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {IrrigationCottonapplications.filter(
                            (app) => app.teamName === selectedUser.teamName
                          )
                            .filter((app) => app.options === "calendar") // Filter data for "calendar" option
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((app, index) => (
                              <TableRow key={app.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {app.date.substring(0, 10)}
                                </TableCell>
                                <TableCell>
                                  {app.dateToday.substring(0, 10)}
                                </TableCell>
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
                                      <HighlightOffIcon
                                        onClick={() =>
                                          handleChangeApplied1(app.id)
                                        }
                                      />
                                    ) : (
                                      <DoneIcon />
                                    )}
                                  </button>
                                </TableCell>

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
                                      <DeleteIcon
                                        onClick={() =>
                                          handleDeleteApplication1(app.id)
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
                      <Typography variant="h6" gutterBottom>
                        Evapotranspiration based Irrigation Data
                      </Typography>
                      <Table
                        size="small"
                        aria-label="Irrigation Management Table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Application Date</TableCell>
                            <TableCell>Submitted Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Applied</TableCell>
                            <TableCell>
                              <EditIcon />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {IrrigationCottonapplications.filter(
                            (app) => app.teamName === selectedUser.teamName
                          )
                            .filter(
                              (app) => app.options === "evapotranspiration"
                            ) // Filter data for "evapotranspiration" option
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((app, index) => (
                              <TableRow key={app.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {app.date.substring(0, 10)}
                                </TableCell>
                                <TableCell>
                                  {app.dateToday.substring(0, 10)}
                                </TableCell>
                                <TableCell>{app.reading}</TableCell>
                                {/* <TableCell>{app.applied}</TableCell> */}
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
                                      <HighlightOffIcon
                                        onClick={() =>
                                          handleChangeApplied1(app.id)
                                        }
                                      />
                                    ) : (
                                      <DoneIcon />
                                    )}
                                  </button>
                                </TableCell>

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
                                      <DeleteIcon
                                        onClick={() =>
                                          handleDeleteApplication1(app.id)
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
                      <Typography variant="h6" gutterBottom>
                        Soil - Moisture based Irrigation Data
                      </Typography>
                      <Table
                        size="small"
                        aria-label="Irrigation Management Table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Application Date</TableCell>
                            <TableCell>Submitted Date</TableCell>
                            <TableCell>Amount</TableCell>
                            {/* <TableCell>Sensor</TableCell> */}
                            <TableCell>Applied</TableCell>
                            <TableCell>
                              <EditIcon />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {IrrigationCottonapplications.filter(
                            (app) => app.teamName === selectedUser.teamName
                          )
                            .filter((app) => app.options === "soil-moisture") // Filter data for "soil-moisture" option
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((app, index) => (
                              <TableRow key={app.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {app.date.substring(0, 10)}
                                </TableCell>
                                <TableCell>
                                  {app.dateToday.substring(0, 10)}
                                </TableCell>
                                <TableCell>{app.reading}</TableCell>
                                {/* <TableCell>{app.sensorType}</TableCell> */}
                                {/* <TableCell>{app.applied}</TableCell> */}
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
                                      <HighlightOffIcon
                                        onClick={() =>
                                          handleChangeApplied1(app.id)
                                        }
                                      />
                                    ) : (
                                      <DoneIcon />
                                    )}
                                  </button>
                                </TableCell>

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
                                      <DeleteIcon
                                        onClick={() =>
                                          handleDeleteApplication1(app.id)
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

                    {/* Seeding Rate content */}
                  </TabPanel>
                  <TabPanel value={value1} index={5}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Insurance Selection
                    </Typography>
                    {/* Hybrid Selection content */}
                    <Card sx={{ marginBottom: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Existing Insurance Selection Data
                        </Typography>
                        <ul>
                          {InsuranceCottonFormData.filter(
                            (data) => data.teamName === selectedUser.teamName
                          ) // Filter data for the selected user
                            .map((data, index) => (
                              <li key={index}>
                                Coverage: {data.coverage}, Level: {data.level}
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabPanel>

                  <TabPanel value={value1} index={6}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Growth Regulator
                    </Typography>
                    <div className="table-container">
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>Date (EST)</TableCell>
                              <TableCell>Regulator</TableCell>
                              <TableCell>Rate</TableCell>
                              <TableCell>Applied</TableCell>
                              <TableCell>
                                <EditIcon />
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {growthRegulationCotton
                              .filter(
                                (option) =>
                                  option.teamName === selectedUser.teamName
                              ) // Filter data for the selected user
                              .map((option, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{option.date}</TableCell>
                                  <TableCell>{option.regulator}</TableCell>
                                  <TableCell>{option.rate}</TableCell>
                                  <TableCell>
                                    <button
                                      style={{
                                        backgroundColor:
                                          option.applied === "no"
                                            ? "red"
                                            : "green",
                                        color: "white", // Assuming you want white text for contrast
                                        border: "none", // Remove default button border styling
                                        // Add any other styling you need here
                                      }}
                                    >
                                      {option.applied === "no" ? (
                                        <HighlightOffIcon
                                          onClick={() =>
                                            handleGrowthChangeApplied(option.id)
                                          }
                                        />
                                      ) : (
                                        <DoneIcon />
                                      )}
                                    </button>
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      style={{
                                        backgroundColor:
                                          option.applied === "no"
                                            ? "red"
                                            : "green",
                                        color: "white", // Assuming you want white text for contrast
                                        border: "none", // Remove default button border styling
                                        // Add any other styling you need here
                                      }}
                                    >
                                      {option.applied === "no" ? (
                                        <DeleteIcon
                                          onClick={() =>
                                            handleDeleteGrowthApplication(
                                              option.id
                                            )
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
                    </div>
                  </TabPanel>

                  <TabPanel value={value1} index={7}>
                    <Typography variant="h4" backgroundColor="secondary">
                      Marketing Options
                    </Typography>
                    <div className="table-container">
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>Date (EST)</TableCell>
                              <TableCell>Contract Type</TableCell>
                              <TableCell>Quantity Bushels</TableCell>
                              {/* <TableCell>Complete</TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {marketingCottonOptions
                              .filter(
                                (option) =>
                                  option.teamName === selectedUser.teamName
                              ) // Filter data for the selected user
                              .map((option, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{option.date}</TableCell>
                                  <TableCell>{option.contractType}</TableCell>
                                  <TableCell>
                                    {option.quantityBushels}
                                  </TableCell>
                                  {/* <TableCell>{option.complete}</TableCell> */}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </TabPanel>
                  <TabPanel value={value1} index={8}>
                    <Typography variant="h4" backgroundColor="secondary">
                      File Management
                    </Typography>
                    {/* Hybrid Selection content */}
                    <div>
                      <div id="uploadStatus"></div>
                      <Box ml={2}>
                        <h5>Insurance Selection</h5>
                        <p style={{ textAlign: "justify" }}>
                          Choose a file that contains details for teams to check
                          insurance options
                        </p>
                        <input type="file" id="insuranceFileInput1" />
                        <button onClick={handleCottonInsuranceFileUpload}>
                          Upload Insurance
                        </button>
                      </Box>
                      <Box ml={2}>
                        <h5>Marketing Options</h5>
                        <p style={{ textAlign: "justify" }}>
                          Choose a file that contains details for teams to check
                          marketing options
                        </p>
                        <input type="file" id="marketingOptionsFileInput1" />
                        <button
                          onClick={handleCottonMarketingOptionsFileUpload}
                        >
                          Upload Marketing Options
                        </button>
                      </Box>
                      <Box ml={2}>
                        <h5>General Files</h5>
                        <p style={{ textAlign: "justify" }}>
                          Choose a file to upload for all teams
                        </p>
                        <input type="file" id="defaultCottonFileInput" />
                        <button onClick={handledefaultFileUpload}>
                          Upload Default File
                        </button>
                      </Box>
                      <p style={{ textAlign: "justify" }}></p>
                      <Box ml={2}>
                        <h5>Team Specific Files</h5>
                        <p style={{ textAlign: "justify" }}>
                          Choose a file to upload for this team
                        </p>
                        <input
                          type="file"
                          id="defaultFileInput2"
                          onChange={handleFileChange1}
                        />
                        <button
                          onClick={() =>
                            handleteamFileUpload1(selectedUser.teamName)
                          }
                        >
                          Upload File
                        </button>
                      </Box>
                    </div>
                    <p style={{ textAlign: "justify" }}></p>
                    <Container>
                      <Paper elevation={3} style={{ padding: "20px" }}>
                        <Typography variant="h5" gutterBottom>
                          List of Files in Uploads Folder:
                        </Typography>
                        <List>
                          {cottondefaultfiles
                            .filter((fileName) => fileName !== "metadata.json")
                            .map((fileName, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={fileName} />

                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadDefaultCottonFile/${fileName}`
                                    )
                                  }
                                >
                                  Download
                                </Button>
                                <Button
                                  onClick={() =>
                                    handlecottondefaultDelete(fileName)
                                  }
                                >
                                  Delete
                                </Button>
                                {/* <Link
                                    href={`/api/deletedefaultFile/${fileName}`}
                                    delete
                                  >
                                    Delete
                                  </Link> */}
                              </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" gutterBottom>
                          Team Files:
                        </Typography>
                        <List>
                          {cottonteamfiles
                            .filter(
                              (fileName) => !fileName.startsWith("profile.")
                            )
                            .filter((fileName) => fileName !== "Thumbs.db")
                            .map((fileName, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={fileName} />
                                {/* <Link
                                  href={`/api/downloadCottonTeamFile/${selectedUser.teamName}/${fileName}`}
                                  download
                                >
                                  Download
                                </Link> */}
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadCottonTeamFile/${selectedUser.teamName}/${fileName}`
                                    )
                                  }
                                >
                                  Download
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleCottonTeamFileDelete(
                                      fileName,
                                      selectedUser.teamName
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" gutterBottom>
                          Insurance Files:
                        </Typography>
                        <List>
                          {cottoninsurancefiles
                            .filter((fileName) => fileName !== "metadata.json")
                            .map((fileName, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={fileName} />
                                {/* <Link
                                  href={`/api/downloadInsuranceCottonFile/${fileName}`}
                                  download
                                >
                                  Download
                                </Link> */}
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadInsuranceCottonFile/${fileName}`
                                    )
                                  }
                                >
                                  Download
                                </Button>
                                <Button
                                  onClick={() =>
                                    handlecottoninsuranceDelete(fileName)
                                  }
                                >
                                  Delete
                                </Button>
                                {/* <Link
                                    href={`/api/deleteinsuranceFile/${fileName}`}
                                  >
                                    Delete
                                  </Link> */}
                              </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" gutterBottom>
                          Marketing Files:
                        </Typography>
                        <List>
                          {cottonmarketingfiles
                            .filter((fileName) => fileName !== "metadata.json")
                            .map((fileName, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={fileName} />
                                {/* <Link
                                  href={`/api/downloadMarketingCottonFile/${fileName}`}
                                  download
                                >
                                  Download
                                </Link> */}
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleDownload(
                                      `downloadMarketingCottonFile/${fileName}`
                                    )
                                  }
                                >
                                  Download
                                </Button>
                                <Button
                                  onClick={() =>
                                    handlecottonmarketingDelete(fileName)
                                  }
                                >
                                  Delete
                                </Button>
                                {/* <Link
                                    href={`/api/deletemarketingFile/${fileName}`}
                                  >
                                    Delete
                                  </Link> */}
                              </ListItem>
                            ))}
                        </List>
                      </Paper>
                    </Container>
                  </TabPanel>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>
      {/* </TabPanel> */}
    </div>
  );
}

export default CottonAdminPage;
