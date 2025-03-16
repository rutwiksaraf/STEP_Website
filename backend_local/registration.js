const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sql = require("mssql");
const bcrypt = require("bcrypt");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stepnotification2024@gmail.com", // Replace with your email
    pass: "xeci cnoq ezff mbaf", // Replace with your email password or app password
  },
});

// Registration API
router.post("/register", async (req, res) => {
  const formData = { ...req.body }; // Clone formData to avoid mutating the original request body
  const formDataToSend = {
    ...formData,
    address2: formData.address2 || "", // If address2 is empty or undefined, set it to ""
  };
  

  const { cropType, teamMembers } = formDataToSend;

  delete formDataToSend.teamMembers; // Remove teamMembers from formData to avoid the "Invalid string" error

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const checkRequest = pool.request();

    // Add parameter for teamName to the request
    checkRequest.input("teamName", sql.VarChar, formDataToSend.teamName);

    let checkSql;

    // Define SQL statement to check for existing team based on the crop type
    if (cropType === "corn") {
      checkSql = `SELECT * FROM [2025_corn_registration_data] WHERE teamName = @teamName`;
    } else if (cropType === "cotton") {
      checkSql = `SELECT * FROM [2025_cotton_registration_data] WHERE teamName = @teamName`;
    } else {
      return res.status(400).json({ message: "Unsupported crop type" });
    }

    // Check if a team with the same name already exists
    const checkResult = await checkRequest.query(checkSql);
    if (checkResult.recordset.length > 0) {
      // Team name already exists
      return res.status(409).json({
        message: "Team name already exists. Use a different team name",
      });
    }
    const registrationRequest = pool.request(); // Create a new request object for registration

    // Add parameters for registration data to the request
    Object.keys(formDataToSend).forEach((key) => {
      registrationRequest.input(key, formDataToSend[key]); // Adjust SQL data types as necessary
    });

    let registrationSql, teamMembersTable;

    // Define SQL statement and team members table based on the crop type
    if (cropType === "corn") {
      registrationSql = `
        INSERT INTO [2025_corn_registration_data] (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
        VALUES (@teamName, @cropType, @password, @captainFirstName, @captainLastName, @address1, @address2, @city, @state, @zipCode, @country, @email, @phone);
        SELECT SCOPE_IDENTITY() AS teamId;
      `;
      teamMembersTable = "[2025_corn_team_members]";
    } else if (cropType === "cotton") {
      registrationSql = `
        INSERT INTO [2025_cotton_registration_data] (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
        VALUES (@teamName, @cropType, @password, @captainFirstName, @captainLastName, @address1, @address2, @city, @state, @zipCode, @country, @email, @phone);
        SELECT SCOPE_IDENTITY() AS teamId;
      `;
      teamMembersTable = "[2025_cotton_team_members]";
    } else {
      return res.status(400).json({ message: "Unsupported crop type" });
    }

    const registrationResult = await registrationRequest.query(registrationSql);
    const teamId = registrationResult.recordset[0].teamId;

    // Insert team members
    for (let member of teamMembers) {
      const teamMembersRequest = pool.request(); // Create a new request object for each team member
      teamMembersRequest.input("teamId", sql.Int, teamId);
      teamMembersRequest.input("name", sql.VarChar, member.name);
      teamMembersRequest.input("email", sql.VarChar, member.email);
      await teamMembersRequest.query(`
        INSERT INTO ${teamMembersTable} (teamId, name, email)
        VALUES (@teamId, @name, @email)
      `);
    }

    // Send confirmation email
    let emailContent = `You have been successfully registered.\nUsername & Team name: ${formDataToSend.teamName}\n`;
    emailContent += `Crop: ${formDataToSend.cropType}\nEmail: ${formDataToSend.email}\nPassword: ${formDataToSend.password}`;

    const mailOptions = {
      from: "stepnotification2024@gmail.com",
      to: formDataToSend.email,
      subject: "STEP Team Registration Successful",
      text: emailContent,
    };
    let internalEmailContent = `Team has been successfully registered.\nUsername & Team name: ${formDataToSend.teamName} \n Captain Email: ${formDataToSend.email}`;
    const internalRecipients = ["rutwiksaraf@ufl.edu", "sbhambota@ufl.edu", "jonescarson@ufl.edu", "vsharma1@ufl.edu"].join(",");

    const InternalMailOptions = {
      from: "stepnotification2024@gmail.com",
      to: internalRecipients,
      subject: "STEP Team Registration Successful",
      text: internalEmailContent,
    };

    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error("Email sending error: ", emailError);
        return res.status(500).json({ message: "Email sending failed" });
      }
      console.log("Email sent: " + info.response);
      res.status(201).json({ message: "Registration successful" });
    });

    transporter.sendMail(InternalMailOptions, (emailError, info) => {
      if (emailError) {
        console.error("Email sending error: ", emailError);
        return res.status(500).json({ message: "Email sending failed" });
      }
      console.log("Email sent: " + info.response);
      res.status(201).json({ message: "Registration successful" });
    });



  } catch (error) {
    console.error("Error handling registration:", error);
    res.status(500).json({ message: "Registration failed" });
  }
  

  
});

router.post("/forgot-password", async (req, res) => {
  const { username, cropType } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Choose the correct table based on the cropType
    const userTable =
      cropType === "corn"
        ? "[2025_corn_registration_data]"
        : "[2025_cotton_registration_data]";

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, username);

    // SQL to get the email of the user
    const getEmailSql = `SELECT email, id FROM ${userTable} WHERE teamName = @teamName`;
    const { recordset } = await request.query(getEmailSql);

    if (recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, id } = recordset[0];

    // Generate a secure token
    const token = crypto.randomBytes(20).toString("hex");
    // const expirationTime = new Date(Date.now() + 3600000); // 1 hour in the future
    const expirationTime = Math.floor((Date.now() + 3600000) / 1000);
    // Insert token into the password_reset_tokens table
    const insertTokenRequest = pool.request();
    insertTokenRequest.input("userId", sql.Int, id);
    insertTokenRequest.input("userType", sql.VarChar, cropType);
    insertTokenRequest.input("token", sql.VarChar, token);
    //insertTokenRequest.input("expires", sql.DateTime, expirationTime);
    insertTokenRequest.input("expires", sql.BigInt, expirationTime);
    await insertTokenRequest.query(`
      INSERT INTO [2025_password_reset_tokens] (userId, userType, token, expires)
      VALUES (@userId, @userType, @token, @expires)
    `);

    // Sending email
    const resetLink = `https://step-app.ifas.ufl.edu/reset-password?token=${token}`;

    const mailOptions = {
      from: "stepnotification2024@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Please use the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({ message: "Error sending reset email" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: `Password reset email sent to ${email}` });
    });
  } catch (error) {
    console.error("Database error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    let tokenRequest = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    tokenRequest.input("token", sql.VarChar, token);
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    // SQL to get the user information based on the token
    tokenRequest.input("currentTimestamp", sql.BigInt, currentTimestamp);

    const tokenResults = await tokenRequest.query(`
  SELECT userId, userType, expires FROM [2025_password_reset_tokens] 
  WHERE token = @token AND expires >= @currentTimestamp
`);

    if (tokenResults.recordset.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { userId, userType } = tokenResults.recordset[0];
    const userTable =
      userType === "corn"
        ? "[2025_corn_registration_data]"
        : "[2025_cotton_registration_data]";

    // Hash the new password
    //const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const hashedPassword = newPassword;

    // SQL to update the user's password
    let passwordRequest = pool.request();
    passwordRequest.input("hashedPassword", sql.VarChar, hashedPassword);
    passwordRequest.input("userId", sql.Int, userId);
    await passwordRequest.query(`
      UPDATE ${userTable}
      SET password = @hashedPassword
      WHERE id = @userId
    `);

    // Optionally, delete the token from the database
    let deleteTokenRequest = pool.request();
    deleteTokenRequest.input("token", sql.VarChar, token);
    await deleteTokenRequest.query(
      `DELETE FROM [2025_password_reset_tokens] WHERE token = @token`
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error processing reset-password request: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
