import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
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
  Typography,
  Card,
  CardContent,
  Paper,
  Stack,
} from "@mui/material";
import { fromZonedTime, format, toZonedTime } from "date-fns-tz";

function ContractPrices() {
  const token = localStorage.getItem("token");
  const [contractPrices, setContractPrices] = useState([]);
  const [displayDate, setDisplayDate] = useState("");
  const [date, setDate] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");

  const saveCottonContractPrices = async () => {
  try {
    const formDataToSubmit = {
      date: date, // use the processed date, not new Date().toISOString()
      contractPrice: contractPrices,
    };

    const response = await axios.post(
      "/api/cottonAddContractPrices",
      formDataToSubmit,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      console.log("Data sent to the backend successfully");
      setContractPrices("");
      setDisplayDate("");
      setSubmissionMessage("✅ Price submitted successfully!");
    } else {
      console.error("Failed to send data to the backend");
      setSubmissionMessage("❌ Failed to submit price.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    setSubmissionMessage("❌ Error submitting price.");
  }
};


  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    const timeZone = "America/Chicago";
    const localMidnight = new Date(`${selectedDate}T00:00:00`);
    const utcDate = fromZonedTime(localMidnight, timeZone);

    setDisplayDate(selectedDate); // shown in textfield
    setDate(utcDate.toISOString()); // sent to backend
  };

  return (
    <div style={{ maxWidth: "550px" }}>
        
      <h2>Contract Prices</h2>
      {submissionMessage && (
        <Typography
          variant="body1"
          style={{
            color: submissionMessage.includes("successfully") ? "green" : "red",
            marginBottom: "10px",
          }}
        >
          {submissionMessage}
        </Typography>
      )}

      <Stack spacing={2}>
        <TextField
          label="Date"
          variant="outlined"
          fullWidth
          type="date"
          value={displayDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          label="Price (cents/lb)"
          variant="outlined"
          fullWidth
          value={contractPrices}
          onChange={(e) => setContractPrices(e.target.value)}
          required
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={saveCottonContractPrices}
        >
          Submit Contract Price
        </Button>
      </Stack>
    </div>
  );
}

export default ContractPrices;
