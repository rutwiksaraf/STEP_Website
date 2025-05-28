const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Define a route for inserting marketing options
router.post("/insertMarketingOption", async (req, res) => {
  const { teamName, date, contractType, quantityBushels, complete } = req.body;

  const submitteddate = new Date().toISOString(); // current timestamp in ISO format
  const now = new Date();
  const estOffsetMinutes =
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      hour: "2-digit",
    }) === new Date().getUTCHours().toString().padStart(2, "0")
      ? 300
      : 240;

  const localMidnight = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  );
  const estMidnightUTC = new Date(
    localMidnight.getTime() + estOffsetMinutes * 60 * 1000
  );

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("date", sql.DateTime, new Date(date));
    request.input("contractType", sql.VarChar, contractType);
    request.input("quantityBushels", sql.VarChar, quantityBushels);
    request.input("complete", sql.VarChar, complete);
    request.input("submitteddate", sql.DateTime, new Date(submitteddate));

    request.input("today", sql.DateTime, estMidnightUTC);


    // Insert a new marketing option
    await request.query(`
      INSERT INTO [2025_marketing_options] (teamName, date, contractType, quantityBushels, complete, submitteddate, completedon)
      VALUES (@teamName, @date, @contractType, @quantityBushels, @complete, @submitteddate, @today)
    `);

    res.status(200).json({ message: "Option inserted successfully" });
  } catch (insertError) {
    console.error(
      "Error inserting marketing option into the database:",
      insertError
    );
    res.status(500).json({ message: "Option insertion failed" });
  }
});

// Define a route for fetching marketing options
router.get("/fetchMarketingOptions", async (req, res) => {
  const { teamName } = req.query; // Extract the teamName from the query parameters

  if (!teamName) {
    return res
      .status(400)
      .json({ message: "Team name is required as a query parameter" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Query the database to fetch all marketing options for the specified teamName
    const result = await request.query(
      "SELECT * FROM [2025_marketing_options] WHERE teamName = @teamName"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching marketing options:", error);
    res.status(500).json({ message: "Error fetching options" });
  }
});

router.get("/fetchAllMarketingOptions", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all marketing options
    const result = await request.query(
      "SELECT * FROM [2025_marketing_options]"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching marketing options:", error);
    res.status(500).json({ message: "Error fetching options" });
  }
});

router.post("/updateCompleted/:appId", async (req, res) => {
  const appId = req.params.appId;
  const newCompleteValue = "yes";

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  // === Manual EST/EDT offset approach ===
  const now = new Date();

  // Get current EST/EDT offset in minutes
  const estOffsetMinutes =
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour12: false,
      hour: "2-digit",
    }) === new Date().getUTCHours().toString().padStart(2, "0")
      ? 300 // EST (UTC-5)
      : 240; // EDT (UTC-4)

  const localMidnight = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  );
  const estMidnightUTC = new Date(
    localMidnight.getTime() + estOffsetMinutes * 60 * 1000
  );

  try {
    const pool = await setupDatabase();
    const request = pool.request();

    request.input("newCompleteValue", sql.VarChar, newCompleteValue);
    request.input("today", sql.DateTime, estMidnightUTC);
    request.input("appId", sql.Int, appId);

    await request.query(`
      UPDATE [2025_marketing_options] 
      SET complete = @newCompleteValue, completedon = @today 
      WHERE id = @appId
    `);

    res.status(200).json({ message: "Record updated successfully" });
  } catch (updateError) {
    console.error("Error updating the record:", updateError);
    res.status(500).json({ message: "Error updating the record" });
  }
});

router.delete("/deletemarketingApplication/:appId", async (req, res) => {
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
      "DELETE FROM [2025_marketing_options] WHERE id = @appId"
    );

    res
      .status(200)
      .json({ message: "Marketing application deleted successfully" });
  } catch (deleteError) {
    console.error("Error deleting the marketing data:", deleteError);
    res
      .status(500)
      .json({ message: "Error deleting the marketing application" });
  }
});

module.exports = router;
