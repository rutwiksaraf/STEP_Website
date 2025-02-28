import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminRegistrationForm({ onClose }) {
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });
  const [crops, setCrops] = useState([""]);
  const navigate = useNavigate();
  // Predefined crop options
  const cropOptions = ["Corn", "Cotton"];

  const [registrationMessage, setRegistrationMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (registrationMessage) {
      const timer = setTimeout(() => {
        setRegistrationMessage(""); // Clear the message after 20 seconds
      }, 20000); // 20000 milliseconds = 20 seconds

      // Clear timeout if component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [registrationMessage]);

  const handleAdminDataChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleCropChange = (index, event) => {
    const newCrops = crops.map((crop, cropIndex) => {
      if (index !== cropIndex) return crop;
      return event.target.value;
    });
    setCrops(newCrops);
  };

  const handleAddCrop = () => {
    setCrops([...crops, ""]);
  };

  const handleRemoveCrop = (index) => {
    const newCrops = crops.filter((_, cropIndex) => index !== cropIndex);
    setCrops(newCrops);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit logic goes here
    axios
      .post(
        "/api/registerAdmin",
        { adminData, crops },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        console.log("Response:", response.data);
        if (response.data.message === "successful") {
          // Application deleted successfully, now update the table data
          setRegistrationMessage("Registration successful!");
          //setRedirecting(true);
          setAdminData({
            username: "",
            password: "",
            email: "",
            phone: "",
          });
          setCrops([]);
          console.log("admin registered successfully");
        } else {
          console.error("An error occurred during registration.");
        }
        // Handle success here
      })
      .catch((error) => {
        console.error("Error:", error);
        setRegistrationMessage("An error occurred during registration.");
        // Handle error here
      });
  };

  if (redirecting) {
    return (
      <div className="App">
        <h2 className="success-message">{registrationMessage}</h2>
      </div>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Admin Registration
      </Typography>
      <Button alignItems="right" onClick={onClose}>
        Back to Main Page
      </Button>

      {registrationMessage && (
        <h2 className="success-message">{registrationMessage}</h2>
      )}

      <form onSubmit={handleSubmit}>
        {/* Admin Data Fields */}
        <TextField
          label="Username"
          name="username"
          value={adminData.username}
          onChange={handleAdminDataChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={adminData.password}
          onChange={handleAdminDataChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={adminData.email}
          onChange={handleAdminDataChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          value={adminData.phone}
          onChange={handleAdminDataChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Dynamic Crop Dropdowns */}
        <Typography variant="h6" gutterBottom>
          Manage Crops
        </Typography>
        {crops.map((crop, index) => (
          <Box
            key={index}
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <FormControl fullWidth>
              <InputLabel id={`crop-label-${index}`}>
                Crop {index + 1}
              </InputLabel>
              <Select
                labelId={`crop-label-${index}`}
                id={`crop-${index}`}
                value={crop}
                label={`Crop ${index + 1}`}
                onChange={(e) => handleCropChange(index, e)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {cropOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemoveCrop(index)}
              sx={{ ml: 2 }}
            >
              Remove
            </Button>
          </Box>
        ))}
        <Button variant="outlined" onClick={handleAddCrop} sx={{ mb: 2 }}>
          Add Crop
        </Button>
        <p style={{ textAlign: "justify" }}></p>
        <Button type="submit" variant="contained" color="primary">
          Register Admin
        </Button>
      </form>
    </Box>
  );
}

export default AdminRegistrationForm;

// import React, { useState } from "react";
// import axios from "axios";

// function AdminRegistrationForm() {
//   const [adminData, setAdminData] = useState({
//     username: "",
//     password: "",
//     admin: "",
//     email: "",
//     phone: "",
//   });
//   const [crops, setCrops] = useState([""]);

//   // Predefined crop options
//   const cropOptions = ["Corn", "Cotton", "Wheat", "Rice", "Soybeans", "Other"];

//   const handleAdminDataChange = (e) => {
//     setAdminData({ ...adminData, [e.target.name]: e.target.value });
//   };

//   const handleCropChange = (index, event) => {
//     const newCrops = crops.map((crop, cropIndex) => {
//       if (index !== cropIndex) return crop;
//       return event.target.value;
//     });
//     setCrops(newCrops);
//   };

//   const handleAddCrop = () => {
//     setCrops([...crops, ""]);
//   };

//   const handleRemoveCrop = (index) => {
//     const newCrops = crops.filter((_, cropIndex) => index !== cropIndex);
//     setCrops(newCrops);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // axios.post('http://your-server.com/registerAdmin', { adminData, crops })
//     //     .then(response => {
//     //         console.log('Response:', response.data);
//     //         // Handle success here
//     //     })
//     //     .catch(error => {
//     //         console.error('Error:', error);
//     //         // Handle error here
//     //     });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Admin Registration</h2>

//       {/* Admin Data Fields */}
//       <div>
//         <label>Username:</label>
//         <input
//           type="text"
//           name="username"
//           value={adminData.username}
//           onChange={handleAdminDataChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input
//           type="password"
//           name="password"
//           value={adminData.password}
//           onChange={handleAdminDataChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Email:</label>
//         <input
//           type="email"
//           name="email"
//           value={adminData.email}
//           onChange={handleAdminDataChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Phone:</label>
//         <input
//           type="tel"
//           name="phone"
//           value={adminData.phone}
//           onChange={handleAdminDataChange}
//           required
//         />
//       </div>

//       {/* Admin Data Fields */}
//       {/* ... Same as before ... */}

//       {/* Dynamic Crop Dropdowns */}
//       <h3>Manage Crops</h3>
//       {crops.map((crop, index) => (
//         <div key={index}>
//           <label>Crop {index + 1}:</label>
//           <select value={crop} onChange={(e) => handleCropChange(index, e)}>
//             <option value="">Select a Crop</option>
//             {cropOptions.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//           <button type="button" onClick={() => handleRemoveCrop(index)}>
//             Remove
//           </button>
//         </div>
//       ))}
//       <button type="button" onClick={handleAddCrop}>
//         Add Crop
//       </button>

//       <button type="submit">Register Admin</button>
//     </form>
//   );
// }

// export default AdminRegistrationForm;
