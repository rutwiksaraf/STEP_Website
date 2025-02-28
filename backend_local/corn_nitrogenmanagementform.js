// backend/routes/nitrogen_management_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const nodemailer = require("nodemailer");
const sql = require("mssql");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stepnotification2024@gmail.com", // Replace with your email
    pass: "lirn kwvh quri agrk", // Replace with your email password or app password
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
  } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("applicationType", sql.VarChar, applicationType);
    request.input("placement", sql.VarChar, placement);
    request.input("date", sql.Date, date);
    request.input("amount", sql.VarChar, amount); // Use sql.Decimal if 'amount' is a decimal value
    request.input("applied", sql.VarChar, applied);
    request.input("dateToday", sql.Date, dateToday);

    // Insert a new row without checking for duplicates
    await request.query(`
      INSERT INTO nitrogen_management_form 
      (teamName, applicationType, placement, date, amount, applied, dateToday) 
      VALUES 
      (@teamName, @applicationType, @placement, @date, @amount, @applied, @dateToday)
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
      SELECT * FROM nitrogen_management_form WHERE applicationType = @applicationType AND teamName = @teamName
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
      "SELECT * FROM nitrogen_management_form"
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
      "DELETE FROM nitrogen_management_form WHERE id = @appId"
    );

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (deleteError) {
    console.error("Error deleting the application:", deleteError);
    res.status(500).json({ message: "Error deleting the application" });
  }
});

// router.post("/updateNitrogenApplied/:appId", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract the application ID from the request parameters
//         const appId = req.params.appId;

//         // Define the new value for the "applied" field (e.g., "yes")
//         const newAppliedValue = "yes";

//         // Perform the database update operation
//         const updateQuery =
//           "UPDATE nitrogen_management_form SET applied = ? WHERE id = ?";
//         db.query(
//           updateQuery,
//           [newAppliedValue, appId],
//           (updateError, updateResult) => {
//             if (updateError) {
//               console.error("Error updating the applied field:", updateError);
//               res
//                 .status(500)
//                 .json({ message: "Error updating the applied field" });
//             } else {
//               res
//                 .status(200)
//                 .json({ message: "Applied field updated successfully" });
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Error handling update of the applied field:", error);
//         res.status(500).json({ message: "Internal server error" });
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

// ... Other imports and route setup ...

router.post("/updateNitrogenApplied/:appId", async (req, res) => {
  const appId = req.params.appId; // Extract the application ID from the request parameters
  const newAppliedValue = "yes"; // Define the new value for the "applied" field

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    let teamName = "";
    let recipientEmail = "";
    let dateOfApplication = "";

    // Start a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const fetchTeamNameRequest = new sql.Request(transaction);
    fetchTeamNameRequest.input("appId", sql.Int, appId);
    const fetchTeamNameResult = await fetchTeamNameRequest.query(
      "SELECT teamName,date FROM nitrogen_management_form WHERE id = @appId"
    );

    if (fetchTeamNameResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Application not found" });
    } else {
      teamName = fetchTeamNameResult.recordset[0].teamName;
      dateOfApplication = fetchTeamNameResult.recordset[0].date;
    }

    const updateRequest = new sql.Request(transaction);
    updateRequest.input("newAppliedValue", sql.VarChar, newAppliedValue);
    updateRequest.input("appId", sql.Int, appId);
    await updateRequest.query(
      "UPDATE nitrogen_management_form SET applied = @newAppliedValue WHERE id = @appId"
    );

    const fetchEmailRequest = new sql.Request(transaction);
    fetchEmailRequest.input("teamName", sql.VarChar, teamName);
    const fetchEmailResult = await fetchEmailRequest.query(
      "SELECT email FROM corn_registration_data WHERE teamName = @teamName"
    );

    if (fetchEmailResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Recipient's email not found" });
    } else {
      recipientEmail = fetchEmailResult.recordset[0].email;
    }

    // Commit the transaction if all operations are successful
    await transaction.commit();

    // Send an email after successful database operations
    const emailText = `Hello ${teamName},\n\nYour nitrogen application dated ${dateOfApplication} has been marked as applied`;
    const mailOptions = {
      from: "stepnotification2024@gmail.com", // Use your configured email
      to: recipientEmail,
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
          message: "Applied field updated successfully and email sent",
        });
      }
    });
  } catch (error) {
    console.error("Error handling update of the applied field:", error);
    res.status(500).json({ message: "Internal server error" });
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
      MERGE INTO ApplicationConfirmations WITH (HOLDLOCK) AS target
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
      `SELECT applicationType, isConfirmed FROM ApplicationConfirmations WHERE teamName = @teamName`
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
