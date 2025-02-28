const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

router.get("/get_corn_users", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    const result = await request.query("SELECT * FROM corn_registration_data"); // Execute the query

    res.json(result.recordset); // Send the query results
  } catch (err) {
    console.error("Error fetching Corn users:", err);
    res.status(500).json({ message: "Error fetching Corn users" });
  }
});

router.post("/get_corn_user", async (req, res) => {
  const { teamName } = req.body;

  // Make sure 'teamName' is provided in the request body
  if (!teamName) {
    return res
      .status(400)
      .json({ message: "Missing 'teamName' in the request body" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Execute the query with a parameter
    const result = await request.query(
      "SELECT * FROM corn_registration_data WHERE teamName = @teamName"
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset); // Send the user details
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Define a route for fetching cotton users
router.get("/get_cotton_users", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    const result = await request.query(
      "SELECT * FROM cotton_registration_data"
    ); // Execute the query

    res.json(result.recordset); // Send the query results
  } catch (err) {
    console.error("Error fetching Cotton users:", err);
    res.status(500).json({ message: "Error fetching Cotton users" });
  }
});

router.post("/cornTeamMembers", async (req, res) => {
  try {
    const { id } = req.body; // Assuming you have the team ID in the request body

    if (!id) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamId", sql.Int, id);

    // Execute the query with a parameter
    const result = await request.query(
      "SELECT * FROM corn_team_members WHERE teamId = @teamId"
    );

    // Send the fetched team members data as a JSON response
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching team members from the database:", err);
    res.status(500).json({ message: "Error fetching team members" });
  }
});

router.post("/get_cotton_user", async (req, res) => {
  const teamName = req.body.teamName; // Assuming 'teamName' is in the request body

  // Make sure 'teamName' is provided in the request body
  if (!teamName) {
    return res
      .status(400)
      .json({ message: "Missing 'teamName' in the request body" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);

    // Execute the query with a parameter
    const result = await request.query(
      "SELECT * FROM cotton_registration_data WHERE teamName = @teamName"
    );

    if (result.recordset.length > 0) {
      res.json(result.recordset); // Send the user details
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

router.post("/cottonTeamMembers", async (req, res) => {
  try {
    const { id } = req.body; // Assuming you have the team ID in the request body

    if (!id) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamId", sql.Int, id);

    // Execute the query with a parameter
    const result = await request.query(
      "SELECT * FROM cotton_team_members WHERE teamId = @teamId"
    );

    // Send the fetched team members data as a JSON response
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching team members from the database:", err);
    res.status(500).json({ message: "Error fetching team members" });
  }
});

router.delete("/deleteCornUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const deleteTeamMembersRequest = new sql.Request(transaction);
    deleteTeamMembersRequest.input("userId", sql.Int, userId);
    await deleteTeamMembersRequest.query(
      "DELETE FROM corn_team_members WHERE teamId = @userId"
    );

    const deleteUserRequest = new sql.Request(transaction);
    deleteUserRequest.input("userId", sql.Int, userId);
    await deleteUserRequest.query(
      "DELETE FROM corn_registration_data WHERE id = @userId"
    );

    await transaction.commit();
    res.send("Corn user and associated team members successfully deleted");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting corn user:", error);
    res.status(500).send("Failed to delete corn user");
  }
});

router.delete("/deleteCottonUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const deleteTeamMembersRequest = new sql.Request(transaction);
    deleteTeamMembersRequest.input("userId", sql.Int, userId);
    await deleteTeamMembersRequest.query(
      "DELETE FROM cotton_team_members WHERE teamId = @userId"
    );

    const deleteUserRequest = new sql.Request(transaction);
    deleteUserRequest.input("userId", sql.Int, userId);
    await deleteUserRequest.query(
      "DELETE FROM cotton_registration_data WHERE id = @userId"
    );

    await transaction.commit();
    res.send("Cotton user and associated team members successfully deleted");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error deleting cotton user:", error);
    res.status(500).send("Failed to delete cotton user");
  }
});

module.exports = router;
