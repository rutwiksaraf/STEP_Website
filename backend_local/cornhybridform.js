// backend/routes/corn_hybrid_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Define a route for handling form submissions
// Define a route for handling form submissions
router.post("/cornhybridsubmit", async (req, res) => {
  const { hybrid, cost, notes, teamName } = req.body; // Extract data from the request body

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("hybrid", sql.VarChar, hybrid);
    request.input("cost", sql.Money, cost); // Adjust the type if necessary
    request.input("notes", sql.Text, notes);

    // Check if a row with the same teamName already exists
    const checkResult = await request.query(
      "SELECT * FROM corn_hybrid_form WHERE teamName = @teamName"
    );

    if (checkResult.recordset.length === 0) {
      // No existing row found, insert a new row
      await request.query(
        "INSERT INTO corn_hybrid_form (teamName, hybrid, cost, notes) VALUES (@teamName, @hybrid, @cost, @notes)"
      );
    } else {
      // Existing row found, update the row with new details
      await request.query(
        "UPDATE corn_hybrid_form SET hybrid = @hybrid, cost = @cost, notes = @notes WHERE teamName = @teamName"
      );
    }

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define a route for fetching submitted forms data for a specific user
// Backend code
// Modify the route to handle POST requests
router.post("/getCornHybridSubmittedForms", async (req, res) => {
  const { username } = req.body; // Extract the username from the request body

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, username);

    // Define the SQL query to fetch submitted forms data for the specified user
    const result = await request.query(
      "SELECT * FROM corn_hybrid_form WHERE teamName = @teamName"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching submitted forms data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

router.get("/getAllCornSubmittedHybridForms", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all submitted hybrid forms for corn
    const result = await request.query("SELECT * FROM corn_hybrid_form");

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching submitted forms data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

module.exports = router;
