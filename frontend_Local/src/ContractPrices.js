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
  const [contractPriceTableData, setContractPriceTableData] = useState([]);

  const fetchContractPrices = () => {
    axios
      .get("/api/cottonGetContractPrices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const sortedData = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date) // DESC order
          );
          setContractPriceTableData(sortedData);
        } else {
          console.error("Failed to fetch data from the backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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
        fetchContractPrices();
      } else {
        console.error("Failed to send data to the backend");
        setSubmissionMessage("❌ Failed to submit price.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionMessage("❌ Error submitting price.");
    }
  };

  useEffect(() => {
    fetchContractPrices();
  }, []);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    const timeZone = "America/Chicago";
    const localMidnight = new Date(`${selectedDate}T00:00:00`);
    const utcDate = fromZonedTime(localMidnight, timeZone);

    setDisplayDate(selectedDate); // shown in textfield
    setDate(utcDate.toISOString()); // sent to backend
  };

  return (
    <div>
      <h2>Add Contract Prices</h2>
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

      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
        {/* Left: Form */}
        <div style={{ minWidth: "300px", flex: 1 }}>
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

        {/* Right: Table */}

        <TableContainer
          component={Paper}
          style={{
            flex: 1,
            maxHeight: "400px",
            overflowY: "auto",
            maxWidth: "700px",
            marginRight: "50px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#002657" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Date
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Contract Price (cents/lb)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractPriceTableData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  }}
                >
                  <TableCell>
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{row.contractPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default ContractPrices;
