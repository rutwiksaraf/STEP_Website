// backend/routes/[2025_nitrogen_management_form].js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const nodemailer = require("nodemailer");
const sql = require("mssql");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "floridastepcontest@gmail.com", // Replace with your email
    pass: "ursc dlhk cdug uwqv", // Replace with your email password or app password
  },
});

// Define a route for handling nitrogen management form submissions
router.post("/nitrogenmanagementsubmit", async (req, res) => {
  const {
    applicationType,
    placement,
    date,
    amount,
    teamName,
    applied,
    dateToday,
    productOption
  } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("placement", sql.VarChar, placement);
    request.input("date", sql.DateTime, new Date(date));
    request.input("amount", sql.VarChar, amount); // Use sql.Decimal if 'amount' is a decimal value
    request.input("applied", sql.VarChar, applied);
    request.input("dateToday", sql.DateTime, new Date(dateToday));
    request.input("productOption", sql.VarChar, productOption);

    // Insert a new row without checking for duplicates
    await request.query(`
      INSERT INTO [2025_nitrogen_management_form] 
      (teamName, applicationType, placement, date, amount, applied, dateToday, productOption) 
      VALUES 
      (@teamName, @applicationType, @placement, @date, @amount, @applied, @dateToday, @productOption)
    `);

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (insertError) {
    console.error("Error inserting form data into the database:", insertError);
    res.status(500).json({ message: "Form submission failed" });
  }
});

router.get("/fetchNitrogenManagementData", async (req, res) => {
  const { applicationType, teamName } = req.query; // Extract the applicationType and teamName from the query parameters

  if (!applicationType || !teamName) {
    return res.status(400).json({
      message:
        "Application type and team name are required as query parameters",
    });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("teamName", sql.VarChar, teamName);

    // Query the database based on the applicationType and teamName
    const result = await request.query(`
      SELECT * FROM [2025_nitrogen_management_form] WHERE applicationType = @applicationType AND teamName = @teamName
    `);

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.get("/fetchAllNitrogenManagementData", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all nitrogen management data
    const result = await request.query(
      "SELECT * FROM [2025_nitrogen_management_form]"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.delete("/deletenitrogenApplication/:appId", async (req, res) => {
  const appId = req.params.appId; // Extract the application ID from the request parameters

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("appId", sql.Int, appId);

    // Perform the database delete operation based on the appId
    await request.query(
      "DELETE FROM [2025_nitrogen_management_form] WHERE id = @appId"
    );

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (deleteError) {
    console.error("Error deleting the application:", deleteError);
    res.status(500).json({ message: "Error deleting the application" });
  }
});



router.post("/updateNitrogenApplied/:appId", async (req, res) => {
  const appId = req.params.appId;
  const newAppliedValue = "yes";

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase();
    let teamName = "";
    let teamId = null;
    let dateOfApplication = "";
    let captainEmail = "";

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Step 1: Get teamName and date of application
    const fetchTeamNameRequest = new sql.Request(transaction);
    fetchTeamNameRequest.input("appId", sql.Int, appId);
    const fetchTeamNameResult = await fetchTeamNameRequest.query(
      "SELECT teamName, date FROM [2025_nitrogen_management_form] WHERE id = @appId"
    );

    if (fetchTeamNameResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Application not found" });
    }

    teamName = fetchTeamNameResult.recordset[0].teamName;
    dateOfApplication = fetchTeamNameResult.recordset[0].date;

    // Step 2: Update the applied field
    const updateRequest = new sql.Request(transaction);
    updateRequest.input("newAppliedValue", sql.VarChar, newAppliedValue);
    updateRequest.input("appId", sql.Int, appId);
    await updateRequest.query(
      "UPDATE [2025_nitrogen_management_form] SET applied = @newAppliedValue WHERE id = @appId"
    );

    // Step 3: Get teamId and captain email
    const fetchTeamInfoRequest = new sql.Request(transaction);
    fetchTeamInfoRequest.input("teamName", sql.VarChar, teamName);
    const fetchTeamInfoResult = await fetchTeamInfoRequest.query(
      "SELECT id, email FROM [2025_corn_registration_data] WHERE teamName = @teamName"
    );

    if (fetchTeamInfoResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Team info not found" });
    }

    teamId = fetchTeamInfoResult.recordset[0].id;
    captainEmail = fetchTeamInfoResult.recordset[0].email?.trim();

    // Step 4: Get team member emails
    const fetchTeamMembersRequest = new sql.Request(transaction);
    fetchTeamMembersRequest.input("teamId", sql.Int, teamId);
    const fetchMembersResult = await fetchTeamMembersRequest.query(
      "SELECT email FROM [2025_corn_team_members] WHERE teamId = @teamId"
    );

    await transaction.commit();

    // Step 5: Prepare final list of valid emails
    const memberEmails = fetchMembersResult.recordset
      .map((row) => row.email?.trim())
      .filter((email) => email);

    const allRecipients = [...new Set([...memberEmails, captainEmail])].filter(Boolean);

    if (allRecipients.length === 0) {
      console.warn("No valid emails to send.");
      return res.status(200).json({
        message: "Applied field updated, but no emails sent",
      });
    }

    // Step 6: Send notification
    const emailText = `Hello ${teamName},\n\nYour nitrogen application dated ${dateOfApplication} has been marked as applied.`;

    const mailOptions = {
      from: "floridastepcontest@gmail.com",
      to: allRecipients, // Includes captain + members, no duplicates or empty
      subject: "Nitrogen Application Status Update",
      text: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error: ", error);
        return res.status(500).json({ message: "Email sending failed" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          message: "Applied field updated successfully and email sent to team",
        });
      }
    });
  } catch (error) {
    console.error("Error handling update of the applied field:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/saveApplicationTypeConfirmation", async (req, res) => {
  const { teamName, applicationType, isConfirmed } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("isConfirmed", sql.Bit, isConfirmed);

    // Use the MERGE statement for an upsert operation
    const mergeSql = `
      MERGE INTO [2025_ApplicationConfirmations] WITH (HOLDLOCK) AS target
      USING (VALUES (@teamName, @applicationType, @isConfirmed)) 
      AS source (teamName, applicationType, isConfirmed)
      ON target.teamName = source.teamName AND target.applicationType = source.applicationType
      WHEN MATCHED THEN 
        UPDATE SET isConfirmed = source.isConfirmed
      WHEN NOT MATCHED THEN
        INSERT (teamName, applicationType, isConfirmed) 
        VALUES (source.teamName, source.applicationType, source.isConfirmed);
    `;

    await request.query(mergeSql);

    res.status(200).send("Application type confirmation saved successfully");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving application type confirmation");
  }
});

router.get("/getProductOptionConfirmation", async (req, res) => {
  const { teamName } = req.query;

  if (!teamName) {
    return res.status(400).json({ error: "teamName is required" });
  }

  try {
    const pool = await sql.connect(); // Assumes connection is already configured
    const result = await pool
      .request()
      .input("teamName", sql.NVarChar, teamName)
      .query(`
        SELECT TOP 1 productOption, isConfirmed
        FROM [2025_corn_NTMProductOptions]
        WHERE teamName = @teamName
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No data found for this team" });
    }

    const { productOption, isConfirmed } = result.recordset[0];
    return res.json({ productOption, isConfirmed });
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/saveProductOptionConfirmation", async (req, res) => {
  const { teamName, productOption, isConfirmed } = req.body;

  if (!teamName || !productOption || typeof isConfirmed !== "boolean") {
    return res.status(400).json({ error: "Missing or invalid data fields" });
  }

  try {
    const pool = await sql.connect(); // assumes default config is used
    await pool.request()
      .input("teamName", sql.VarChar, teamName)
      .input("productOption", sql.VarChar, productOption)
      .input("isConfirmed", sql.Bit, isConfirmed)
      .query(`
        INSERT INTO [2025_corn_NTMProductOptions] (teamName, productOption, isConfirmed)
        VALUES (@teamName, @productOption, @isConfirmed)
      `);

    res.status(200).json({ message: "Product option confirmation saved" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to save confirmation" });
  }
});

router.get("/getApplicationTypeConfirmation", async (req, res) => {
  const teamName = req.query.teamName; // Assume teamName is passed as a query parameter

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
      `SELECT applicationType, isConfirmed FROM [2025_ApplicationConfirmations] WHERE teamName = @teamName`
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
