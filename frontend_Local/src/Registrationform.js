import "./App.css";

import React from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Container,
  Grid,
  Typography,
  Box,
  Alert,
} from "@mui/material";

function RegistrationForm({
  formData,
  registrationMessage,
  handleChange,
  handleTeamMemberChange,
  handleAddTeamMember,
  handleDeleteTeamMember,
  handleSubmit,
  redirecting,
}) {
  if (redirecting) {
    return (
      <Box className="App" sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="h5" color="success.main">
          {registrationMessage}
        </Typography>
        <Typography variant="h6">Redirecting to the login page...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="md">
        <Card elevation={5} sx={{ borderRadius: "16px", padding: 4, position: "relative", zIndex: 1 }}>
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ color: "#2c3e50", fontWeight: "bold" }}
            >
              Florida Step Team Registration
            </Typography>
            {registrationMessage && (
              <Alert severity="success" sx={{ marginBottom: 2 }}>
                {registrationMessage}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Crop Type:
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    {["corn", "cotton"].map((crop) => (
                      <Button
                        key={crop}
                        variant={formData.cropType === crop ? "contained" : "outlined"}
                        onClick={() => handleChange({ target: { name: "cropType", value: crop } })}
                        sx={{
                          fontSize: "1.2rem",
                          padding: "12px 24px",
                          backgroundColor: formData.cropType === crop ? "#2c3e50" : "transparent",
                          color: formData.cropType === crop ? "white" : "#2c3e50",
                          borderColor: "#2c3e50",
                          "&:hover": {
                            backgroundColor: "#2c3e50",
                            color: "white",
                          },
                        }}
                      >
                        {crop.charAt(0).toUpperCase() + crop.slice(1)}
                      </Button>
                    ))}
                  </Box>
                </Grid>

                {["teamName", "password", "captainFirstName", "captainLastName", "address1","address2", "city", "state", "zipCode", "country", "email", "phone"].map((field) => (
                  
                  <Grid item xs={12} sm={field.includes("FirstName") || field.includes("LastName") || field.includes("city") || field.includes("state") || field.includes("zipCode") ? 6 : 12} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}

                      name={field}
                      type={field === "password" ? "password" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      required = {field !== "address2"}
                      variant="outlined"
                      sx={{ marginBottom: 2 }}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Team Members:
                  </Typography>
                  {formData.teamMembers.map((member, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 2 }}>
                      <TextField
                        fullWidth
                        label={`Team Member ${index + 1} Name`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      />
                      <TextField
                        fullWidth
                        label={`Team Member ${index + 1} Email`}
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleDeleteTeamMember(index)}
                        variant="outlined"
                        color="error"
                        sx={{ width: "50%" }}
                      >
                        Delete Team Member
                      </Button>
                    </Box>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddTeamMember}
                    variant="outlined"
                    color="secondary"
                    sx={{ width: "50%" }}
                  >
                    Add Team Member
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    fontSize: "1.2rem",
                    padding: "12px 0",
                    "&:hover": { backgroundColor: "#1f2a36" },
                  }}
                >
                  Register
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegistrationForm;
