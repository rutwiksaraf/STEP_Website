const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");
const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stepnotification2024@gmail.com", // Replace with your email
    pass: "xeci cnoq ezff mbaf", // Replace with your email password or app password
  },
});


router.post("/cottonInsertGrowthRegulation", async (req, res) => {
  const { teamName, date, regulator, rate, applied, dateToday } = req.body;

  try {
    const pool = await setupDatabase();
    const request = pool.request();

    request.input("teamName", sql.VarChar, teamName);
    request.input("date", sql.DateTime, new Date(date));            // updated
    request.input("regulator", sql.VarChar, regulator);
    request.input("rate", sql.VarChar, rate);
    request.input("applied", sql.Bit, applied);
    request.input("dateToday", sql.DateTime, new Date(dateToday));  // updated

    await request.query(`
      INSERT INTO [2025_cotton_growth_regulation] 
        (teamName, date, regulator, rate, applied, dateToday)
      VALUES 
        (@teamName, @date, @regulator, @rate, @applied, @dateToday)
    `);

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting growth regulation data:", error);
    res.status(500).json({ message: "Data insertion failed" });
  }
});

router.delete("/deletecottongrowthApplication/:appId", async (req, res) => {
  const appId = req.params.appId;

  if (!appId) {
    return res.status(400).json({ message: "Application ID is required" });
  }

  try {
    const pool = await setupDatabase();
    const request = pool.request();

    request.input("appId", sql.Int, appId);

    await request.query(
      "DELETE FROM [2025_cotton_growth_regulation] WHERE id = @appId"
    );

    res.status(200).json({ message: "Growth regulator application deleted successfully" });
  } catch (error) {
    console.error("Error deleting growth regulation application:", error);
    res.status(500).json({ message: "Error deleting application" });
  }
});



router.get("/cottonFetchGrowthRegulation", async (req, res) => {
  const { teamName } = req.query;
  try {
    const pool = await setupDatabase();
    const request = pool.request();
    request.input("teamName", sql.VarChar, teamName);

    const result = await request.query(`
      SELECT * FROM [2025_cotton_growth_regulation] WHERE teamName = @teamName
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching growth regulation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});


router.get("/cottonFetchAllGrowthRegulation", async (req, res) => {
  try {
    const pool = await setupDatabase();
    const result = await pool.request().query(`
      SELECT * FROM [2025_cotton_growth_regulation]
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching all growth regulation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.post("/updateCottonGrowthApplied/:appId", async (req, res) => {
  const appId = req.params.appId; // Extract the application ID from the request parameters
  const newAppliedValue = true; // Define the new value for the "applied" field

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
      "SELECT teamName,date FROM [2025_cotton_growth_regulation] WHERE id = @appId"
    );

    if (fetchTeamNameResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "Application not found" });
    } else {
      teamName = fetchTeamNameResult.recordset[0].teamName;
      dateOfApplication = fetchTeamNameResult.recordset[0].date;
    }

    const updateRequest = new sql.Request(transaction);
    updateRequest.input("newAppliedValue", sql.Bit, newAppliedValue);
    updateRequest.input("appId", sql.Int, appId);
    await updateRequest.query(
      "UPDATE [2025_cotton_growth_regulation] SET applied = @newAppliedValue WHERE id = @appId"
    );

    const fetchEmailRequest = new sql.Request(transaction);
    fetchEmailRequest.input("teamName", sql.VarChar, teamName);
    const fetchEmailResult = await fetchEmailRequest.query(
      "SELECT email FROM [2025_cotton_registration_data] WHERE teamName = @teamName"
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
    const emailText = `Hello ${teamName},\n\nYour growth regulator application dated ${dateOfApplication} has been marked as applied`;
    const mailOptions = {
      from: "stepnotification2024@gmail.com", // Use your configured email
      to: recipientEmail,
      subject: "Growth Regulator Application Status Update",
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

module.exports = router;
