import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send the data to a backend service
    alert("Form submitted successfully!");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        style={{ textAlign: "center" }}
      >
        Contact Us
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { m: 1, width: "100%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          id="message"
          name="message"
          label="Message"
          variant="outlined"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
}

export default ContactForm;
