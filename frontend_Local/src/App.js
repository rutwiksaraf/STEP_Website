import React, { useState } from "react";
//import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Button, TextField, Container, Grid, Typography } from "@mui/material";
import Navbar from "./Navbar";
import LoginForm from "./LoginForm";
import AdminLoginForm from "./AdminLoginForm";
import RegistrationForm from "./Registrationform";
import AdminPage from "./AdminPage";
import CornAdminPage from "./CornAdminPage";
import CottonAdminPage from "./CottonAdminPage";
import FilterAdminPage from "./AdminPageFiltered";
import Welcome from "./welcome";
import WelcomeCotton from "./welcomecotton";
import { ThemeProvider } from "@mui/material/styles";
import AdminProfile from "./AdminProfile";
import ResetPasswordForm from "./ResetPasswordForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ContactForm from "./contact";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import theme from "./theme";
import { ApplicationProvider } from "./ApplicationContext";
import { ApplicationProvideri } from "./IrrigationContext";
import { ApplicationProviders } from "./SensorContext";
import AnalyticsHandler from "./AnalyticsHandler";


axios.defaults.baseURL = 'http://localhost:3002';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired or unauthorized request");
      localStorage.removeItem("token");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    if (error.response && error.response.status === 403) {
      console.log("Forbidden: Invalid or expired token.");
      // Clear token storage
      localStorage.removeItem("token");
      localStorage.removeItem("token");
      // Redirect to login page or show an error message
      window.location.href = "/login";
      // Optionally, use a more sophisticated method of routing if using a library like React Router
    }
    return Promise.reject(error);
  }
);

function App() {
  //const location = useLocation();
  const [formData, setFormData] = useState({
    cropType: "corn",
    teamName: "",
    password: "",
    captainFirstName: "",
    captainLastName: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    email: "",
    phone: "",
    teamMembers: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: updatedTeamMembers,
    }));
  };

  const handleAddTeamMember = () => {
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: [...prevData.teamMembers, { name: "", email: "" }],
    }));
  };

  const handleDeleteTeamMember = (index) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      teamMembers: updatedTeamMembers,
    }));
  };

  const [registrationMessage, setRegistrationMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.cropType !== "corn" && formData.cropType !== "cotton") {
      alert("Please select a valid Crop Type (Corn or Cotton)."); // You can display an error message or handle it as needed
      return;
    }

    // Send the form data to your Express API
    axios
      .post("/api/register", formData)
      .then((response) => {
        console.log("Response from server:", response.data);
        setRegistrationMessage(response.data.message);
        if (response.data.message === "Registration successful") {
          // Set the registration message
          setRegistrationMessage("Registration successful!");

          alert("Registration successful! Redirecting to Login Page.");

          // Handle success or show a success message
          setTimeout(() => {
            setRedirecting(true);
            // Redirect to the login page after a delay
            window.location.href = "/login";
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        if (error.response) {
          // If the server responded with a message, use it
          setRegistrationMessage(error.response.data.message);
        } else {
          // Generic error message if the response does not contain data
          setRegistrationMessage("An error occurred during registration.");
        }
        // Handle error or show an error message
      });
  };


  // ... (Your existing imports and code)

  return (
    <ApplicationProvider>
      <ApplicationProvideri>
        <ApplicationProviders>
          <ThemeProvider theme={theme}>
            <Router>
            <AnalyticsHandler />
              <div>
                <Navbar />
                <Routes>
                  <Route path="/form" element={<ContactForm />} />
                  <Route path="/" element={<LoginForm />} />
                  <Route
                    path="/register"
                    element={
                      <RegistrationForm
                        formData={formData}
                        registrationMessage={registrationMessage}
                        handleChange={handleChange}
                        handleTeamMemberChange={handleTeamMemberChange}
                        handleAddTeamMember={handleAddTeamMember}
                        handleDeleteTeamMember={handleDeleteTeamMember}
                        handleSubmit={handleSubmit}
                        redirecting={redirecting}
                      />
                    }
                  />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/adminlogin" element={<AdminLoginForm />} />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordForm />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordForm />}
                  />

                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/cornadmin" element={<CornAdminPage />} />
                  <Route path="/cottonadmin" element={<CottonAdminPage />} />
                  <Route path="/adminspage" element={<FilterAdminPage />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/welcomecotton" element={<WelcomeCotton />} />
                  <Route path="/adminprofile" element={<AdminProfile />} />
                  {/* <Route path="/login" component={LoginForm} /> */}
                </Routes>
              </div>
            </Router>
          </ThemeProvider>
        </ApplicationProviders>
      </ApplicationProvideri>
    </ApplicationProvider>
  );
}

export default App;
