const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Define a route for handling soil moisture sensor submissions
router.post("/soilmoisturesensorsubmit", async (req, res) => {
  const { teamName, sensorType, date, reading, options, applied, dateToday } =
    req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("sensorType", sql.VarChar, sensorType);
    request.input("date", sql.DateTime, new Date(date));
    request.input("reading", sql.Float, reading);
    request.input("options", sql.VarChar, options);
    request.input("applied", sql.VarChar, applied);
    request.input("dateToday", sql.DateTime, new Date(dateToday));

    // Insert a new row without checking for duplicates
    await request.query(
      "INSERT INTO [2025_soil_moisture_sensor_data] (teamName, sensorType, date, reading, options, applied, dateToday) VALUES (@teamName, @sensorType, @date, @reading, @options, @applied, @dateToday)"
    );

    res.status(200).json({
      message: "Sensor data submitted successfully",
    });
  } catch (error) {
    console.error("Error inserting sensor data into the database:", error);
    res.status(500).json({ message: "Sensor data submission failed" });
  }
});

// Define a route for fetching soil moisture sensor data
router.get("/fetchSoilMoistureSensorData", async (req, res) => {
  const { teamName } = req.query; // Extract teamName from the query parameters

  if (!teamName) {
    return res
      .status(400)
      .json({ message: "Team name is required in the query parameter" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Query the database to fetch all soil moisture sensor data for the specified team
    const result = await request.query(
      "SELECT * FROM [2025_soil_moisture_sensor_data] WHERE teamName = @teamName"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching sensor data from the database:", error);
    res.status(500).json({ message: "Error fetching sensor data" });
  }
});

router.get("/fetchAllSoilMoistureSensorData", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all soil moisture sensor data
    const result = await request.query(
      "SELECT * FROM [2025_soil_moisture_sensor_data]"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching sensor data from the database:", error);
    res.status(500).json({ message: "Error fetching sensor data" });
  }
});

// Add a new route for deleting an irrigation application by appId
router.delete("/deleteirrigationApplication/:appId", async (req, res) => {
  const appId = req.params.appId; // Extract the application ID from the request parameters

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("appId", sql.Int, appId);

    // Perform the database delete operation
    await request.query(
      "DELETE FROM [2025_soil_moisture_sensor_data] WHERE id = @appId"
    );

    res
      .status(200)
      .json({ message: "Irrigation application deleted successfully" });
  } catch (error) {
    console.error("Error deleting the irrigation application:", error);
    res
      .status(500)
      .json({ message: "Error deleting the irrigation application" });
  }
});

router.post("/updateApplied/:appId", async (req, res) => {
  const appId = req.params.appId; // Extract the application ID from the request parameters
  const newAppliedValue = "yes"; // Define the new value for the "applied" field

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("newAppliedValue", sql.VarChar, newAppliedValue);
    request.input("appId", sql.Int, appId);

    // Perform the database update operation
    await request.query(
      "UPDATE [2025_soil_moisture_sensor_data] SET applied = @newAppliedValue WHERE id = @appId"
    );

    res.status(200).json({ message: "Applied field updated successfully" });
  } catch (error) {
    console.error("Error updating the applied field:", error);
    res.status(500).json({ message: "Error updating the applied field" });
  }
});

router.post("/saveIrrigationApplicationTypeConfirmation", async (req, res) => {
  const { teamName, applicationType, isConfirmed } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("isConfirmed", sql.Bit, isConfirmed);

    // Check if a record already exists and update it, or insert a new one
    const sqlQuery = `
      IF EXISTS (SELECT 1 FROM [2025_IrrigationApplicationConfirmations] WHERE teamName = @teamName AND applicationType = @applicationType)
        UPDATE [2025_IrrigationApplicationConfirmations] SET isConfirmed = @isConfirmed WHERE teamName = @teamName AND applicationType = @applicationType;
      ELSE
        INSERT INTO [2025_IrrigationApplicationConfirmations] (teamName, applicationType, isConfirmed) VALUES (@teamName, @applicationType, @isConfirmed);
    `;

    await request.query(sqlQuery);

    res.status(200).send("Application type confirmation saved successfully");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving application type confirmation");
  }
});

router.get("/getIrrigationApplicationTypeConfirmation", async (req, res) => {
  const { teamName } = req.query; // Assume teamName is passed as a query parameter

  if (!teamName) {
    return res.status(400).send("Team name is required as a query parameter");
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Execute the query
    const result = await request.query(
      `SELECT applicationType, isConfirmed FROM [2025_IrrigationApplicationConfirmations] WHERE teamName = @teamName`
    );

    if (result.recordset.length === 0) {
      // No records found
      res
        .status(404)
        .send("No application type confirmation found for the specified team");
    } else {
      // Assuming you want to return the first result if multiple entries exist
      res.status(200).json(result.recordset[0]);
    }
  } catch (err) {
    console.error("Error fetching application type confirmation:", err);
    res.status(500).send("Error fetching application type confirmation");
  }
});

router.post("/saveMoistureApplicationTypeConfirmation", async (req, res) => {
  const { teamName, applicationType, isConfirmed } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("isConfirmed", sql.Bit, isConfirmed);

    // Use the MERGE statement to insert or update as necessary
    const sqlQuery = `
      MERGE INTO [2025_MoistureApplicationConfirmations] AS target
      USING (SELECT @teamName AS teamName, @applicationType AS applicationType) AS source
      ON target.teamName = source.teamName AND target.applicationType = source.applicationType
      WHEN MATCHED THEN
        UPDATE SET isConfirmed = @isConfirmed
      WHEN NOT MATCHED THEN
        INSERT (teamName, applicationType, isConfirmed)
        VALUES (@teamName, @applicationType, @isConfirmed);
    `;

    await request.query(sqlQuery);

    res.status(200).send("Application type confirmation saved successfully");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving application type confirmation");
  }
});

router.get("/getMoistureApplicationTypeConfirmation", async (req, res) => {
  const { teamName } = req.query; // Assume teamName is passed as a query parameter

  if (!teamName) {
    return res.status(400).send("Team name is required as a query parameter");
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Execute the query
    const result = await request.query(
      `SELECT applicationType, isConfirmed FROM [2025_MoistureApplicationConfirmations] WHERE teamName = @teamName`
    );

    if (result.recordset.length === 0) {
      // No records found
      res
        .status(404)
        .send("No application type confirmation found for the specified team");
    } else {
      // Assuming you want to return the first result if multiple entries exist
      res.status(200).json(result.recordset[0]);
    }
  } catch (err) {
    console.error("Error fetching application type confirmation:", err);
    res.status(500).send("Error fetching application type confirmation");
  }
});

// Export the router for use in your main Express app
module.exports = router;
