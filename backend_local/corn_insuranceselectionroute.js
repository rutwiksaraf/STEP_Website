const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Define a route for handling insurance selection form submissions
router.post("/insurancesubmit", async (req, res) => {
  const { teamName, coverage, level } = req.body;

  // Validate input
  if (!teamName || !coverage || !level) {
    return res
      .status(400)
      .json({ message: "Missing required fields in the request body" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const checkRequest = new sql.Request(transaction);
    checkRequest.input("teamName", sql.VarChar, teamName);

    // Check if a row with the same teamName already exists
    const checkResult = await checkRequest.query(
      "SELECT * FROM [2025_insurance_selection_form] WHERE teamName = @teamName"
    );

    if (checkResult.recordset.length > 0) {
      // If a row with the same teamName exists, update it
      const updateRequest = new sql.Request(transaction);
      updateRequest.input("teamName", sql.VarChar, teamName);
      updateRequest.input("coverage", sql.VarChar, coverage);
      updateRequest.input("level", sql.VarChar, level);

      await updateRequest.query(
        "UPDATE [2025_insurance_selection_form] SET coverage = @coverage, level = @level WHERE teamName = @teamName"
      );
      res.status(200).json({ message: "Insurance form updated successfully" });
    } else {
      // If no row with the same teamName exists, insert a new row
      const insertRequest = new sql.Request(transaction);
      insertRequest.input("teamName", sql.VarChar, teamName);
      insertRequest.input("coverage", sql.VarChar, coverage);
      insertRequest.input("level", sql.VarChar, level);

      await insertRequest.query(
        "INSERT INTO [2025_insurance_selection_form] (teamName, coverage, level) VALUES (@teamName, @coverage, @level)"
      );
      res
        .status(200)
        .json({ message: "Insurance form submitted successfully" });
    }

    await transaction.commit();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error handling insurance form submission:", error);
    res
      .status(500)
      .json({ message: "Failed to process insurance form submission" });
  }
});

// Export the router for use in your main Express app
// Define a route for fetching insurance selection data for a specific user
router.post("/getInsuranceSelectionForms", async (req, res) => {
  const { username } = req.body; // Extract the username from the request body

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("username", sql.VarChar, username);

    // Execute the query to fetch data
    const result = await request.query(
      "SELECT * FROM [2025_insurance_selection_form] WHERE teamName = @username"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching insurance selection data:", err);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

router.get("/getAllInsuranceSelectionForms", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all insurance selection data
    const result = await request.query(
      "SELECT * FROM [2025_insurance_selection_form]"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
    // console.log("scope");
  } catch (err) {
    console.error("Error fetching insurance selection data:", err);
    res.status(500).json({ message: "Failed to fetch data" });
    console.log("error");
  }
});

// Export the router for use in your main Express app
module.exports = router;
