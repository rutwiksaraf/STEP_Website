const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

router.post("/cottonsoilmoisturesensorsubmit", async (req, res) => {
  const {
    teamName,
    sensorType,
    date,
    reading,
    options,
    applied,
    dateToday,
    applicationType,
    sensorConfirmed,
    optionConfirmed,
  } = req.body;

  console.log("Received data:", req.body); // Log the received data for debugging

  // Log the received data for debugging

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("sensorType", sql.VarChar, sensorType);
    request.input("reading", sql.Float, reading);
    request.input("options", sql.VarChar, options);
    request.input("applied", sql.VarChar, applied);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("sensorConfirmed", sql.Bit, sensorConfirmed);
    request.input("optionConfirmed", sql.Bit, optionConfirmed);
    request.input("date", sql.DateTime, new Date(date)); // ensures it's a Date object
    request.input("dateToday", sql.DateTime, new Date(dateToday)); // ensures UTC format

    // Insert a new row without checking for duplicates
    await request.query(`
      INSERT INTO [2025_cotton_soil_moisture_sensor_data]
        (teamName, sensorType, date, reading, options, applied, dateToday, applicationType, sensorConfirmed, optionConfirmed)
      VALUES
        (@teamName, @sensorType, @date, @reading, @options, @applied, @dateToday, @applicationType, @sensorConfirmed, @optionConfirmed);
    `);

    res.status(200).json({
      message: "Sensor data submitted successfully",
    });
  } catch (error) {
    console.error("Error inserting sensor data into the database:", error);
    res.status(500).json({ message: "Sensor data submission failed" });
  }
});

router.get("/cottonfetchSoilMoistureSensorData", async (req, res) => {
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
      "SELECT * FROM [2025_cotton_soil_moisture_sensor_data] WHERE teamName = @teamName"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching sensor data from the database:", error);
    res.status(500).json({ message: "Error fetching sensor data" });
  }
});

router.get("/cottonfetchAllSoilMoistureSensorData", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all soil moisture sensor data
    const result = await request.query(
      "SELECT * FROM [2025_cotton_soil_moisture_sensor_data]"
    );

    // Send the fetched data as a JSON response
    const cleaned = result.recordset.map(row => ({
  ...row,
  teamName: row.teamName?.trim()
}));
res.status(200).json(cleaned);
  } catch (error) {
    console.error("Error fetching sensor data from the database:", error);
    res.status(500).json({ message: "Error fetching sensor data" });
  }
});

router.delete("/deletecottonirrigationApplication/:appId", async (req, res) => {
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
      "DELETE FROM [2025_cotton_soil_moisture_sensor_data] WHERE id = @appId"
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

router.post("/updateCottonApplied/:appId", async (req, res) => {
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
      "UPDATE [2025_cotton_soil_moisture_sensor_data] SET applied = @newAppliedValue WHERE id = @appId"
    );

    res.status(200).json({ message: "Applied field updated successfully" });
  } catch (error) {
    console.error("Error updating the applied field:", error);
    res.status(500).json({ message: "Error updating the applied field" });
  }
});

router.post(
  "/saveIrrigationApplicationTypeConfirmationCotton",
  async (req, res) => {
    const { teamName, applicationType, optionConfirmed } = req.body;

    console.log("Received data:", req.body);

    try {
      const pool = await setupDatabase(); // Obtain a connection pool
      const request = pool.request(); // Create a new request object

      // Add parameters to your SQL query
      request.input("teamName", sql.VarChar, teamName);
      request.input("applicationType", sql.VarChar, applicationType);
      request.input("optionConfirmed", sql.Bit, optionConfirmed);

      // Check if a record already exists and update it, or insert a new one
      const sqlQuery = `
      IF EXISTS (SELECT 1 FROM [2025_cotton_soil_moisture_sensor_data] WHERE teamName = @teamName)
        UPDATE [2025_cotton_soil_moisture_sensor_data] SET optionConfirmed = @optionConfirmed WHERE teamName = @teamName AND applicationType = @applicationType;
      ELSE
        INSERT INTO [2025_cotton_soil_moisture_sensor_data] (teamName, applicationType, optionConfirmed) VALUES (@teamName, @applicationType, @optionConfirmed);
    `;

      await request.query(sqlQuery);

      res.status(200).send("Application type confirmation saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
      res.status(500).send("Error saving application type confirmation");
    }
  }
);

router.get(
  "/getIrrigationApplicationTypeConfirmationCotton",
  async (req, res) => {
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
        `SELECT applicationType, optionConfirmed FROM [2025_cotton_soil_moisture_sensor_data] WHERE teamName = @teamName`
      );

      if (result.recordset.length === 0) {
        // No records found
        res
          .status(404)
          .send(
            "No application type confirmation found for the specified team"
          );
      } else {
        // Assuming you want to return the first result if multiple entries exist
        res.status(200).json(result.recordset[0]);
      }
    } catch (err) {
      console.error("Error fetching application type confirmation:", err);
      res.status(500).send("Error fetching application type confirmation");
    }
  }
);

router.post(
  "/saveMoistureApplicationTypeConfirmationCotton",
  async (req, res) => {
    const { teamName, sensorType, sensorConfirmed } = req.body;

    try {
      const pool = await setupDatabase(); // Obtain a connection pool
      const request = pool.request(); // Create a new request object

      // Add parameters to your SQL query
      request.input("teamName", sql.VarChar, teamName);
      request.input("sensorType", sql.VarChar, sensorType);
      request.input("sensorConfirmed", sql.Bit, sensorConfirmed);

      // Use the MERGE statement to insert or update as necessary
      const sqlQuery = `
      IF EXISTS (SELECT 1 FROM [2025_cotton_soil_moisture_sensor_data] WHERE teamName = @teamName)
BEGIN
    UPDATE [2025_cotton_soil_moisture_sensor_data]
    SET sensorType = @sensorType,
        sensorConfirmed = @sensorConfirmed
    WHERE teamName = @teamName;
END

    `;

      await request.query(sqlQuery);

      res.status(200).send("Application type confirmation saved successfully");
    } catch (err) {
      console.error("Error saving data:", err);
      res.status(500).send("Error saving application type confirmation");
    }
  }
);

router.get(
  "/getMoistureApplicationTypeConfirmationCotton",
  async (req, res) => {
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
        `SELECT sensorType, sensorConfirmed FROM [2025_cotton_soil_moisture_sensor_data] WHERE teamName = @teamName`
      );

      if (result.recordset.length === 0) {
        // No records found
        res
          .status(404)
          .send(
            "No application type confirmation found for the specified team"
          );
      } else {
        // Assuming you want to return the first result if multiple entries exist
        res.status(200).json(result.recordset[0]);
      }
    } catch (err) {
      console.error("Error fetching application type confirmation:", err);
      res.status(500).send("Error fetching application type confirmation");
    }
  }
);

// Export the router for use in your main Express app
module.exports = router;
