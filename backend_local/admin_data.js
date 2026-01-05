// Import the setupDatabase function
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { setupDatabase } = require("./database");
const nodemailer = require("nodemailer");
const { setupDatabaseMiddleware } = require("./database");
const sql = require("mssql");
const secretKey = "step_website";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "floridastepcontest@gmail.com", // Replace with your email
    pass: "ursc dlhk cdug uwqv", // Replace with your email password or app password
  },
});

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  try {
    const tokenWithoutBearer = token.split(" ")[1];
    const verified = jwt.verify(
      tokenWithoutBearer,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.adminId = verified.id; // Assuming the JWT contains the admin ID
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

router.get("/getAdminCrops", async (req, res) => {
  const { adminId } = req.query; // Get the admin ID from the authenticated user
  console.log(adminId);
  try {
    const pool = await setupDatabase(); // Ensure setupDatabase returns a connected SQL Server pool or connection
    const request = pool.request(); // Create a new request for each operation
    request.input("adminId", sql.Int, adminId); // Use input method to define parameters for your query

    const result = await request.query(
      "SELECT name FROM [2025_admin_crops] WHERE userId = @adminId"
    ); // Use named parameters in your query
    console.log("Admin Crops");
    console.log(result);
    const crops = result.recordset.map((row) => row.name); // Access results with recordset
    res.json({ crops });
    console.log(crops);

    // No need to release the connection with mssql package, it's handled automatically
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Failed to connect to the database");
  }
});

// Admin Registration API
router.post("/registerAdmin", async (req, res) => {
  const adminData = req.body.adminData;
  const crops = req.body.crops;
  let transaction;
  try {
    const pool = await setupDatabase(); // Ensure setupDatabase returns a connected SQL Server pool or connection

    // Start a transaction
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Define the SQL statement for inserting admin data
    const adminSql = `
      INSERT INTO [2025_admin_registration_data] (username, password, email, phone)
      OUTPUT INSERTED.id
      VALUES (@username, @password, @email, @phone)
    `;

    // Add parameters to the request
    request.input("username", sql.VarChar, adminData.username);
    request.input("password", sql.VarChar, hashedPassword);
    request.input("email", sql.VarChar, adminData.email);
    request.input("phone", sql.VarChar, adminData.phone);

    // Execute the query and get the inserted admin ID
    const { recordset } = await request.query(adminSql);
    const adminId = recordset[0].id;

    let emailContent = `You have been successfully registered as an admin.\nUsername: ${adminData.username}\n`;
    emailContent += `Password: ${adminData.password}\n`; // Do not send the actual password
    emailContent += `Email: ${adminData.email}\n`;
    emailContent += `Phone: ${adminData.phone}\n`;
    emailContent += `Crop Types: ${crops.join(", ")}`;

    // Send an email with registration details
    const mailOptions = {
      from: "floridastepcontest@gmail.com",
      to: adminData.email,
      subject: "Admin Registration Successful",
      text: emailContent,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Email sending error: ", error);
    }

    // Prepare and execute queries for each crop
    for (let crop of crops) {
      if (crop) {
        const cropRequest = new sql.Request(transaction);
        const cropSql = `
            INSERT INTO [2025_admin_crops] (userId, name)
            VALUES (@userId, @name)
          `;
        await cropRequest
          .input("userId", sql.Int, adminId)
          .input("name", sql.VarChar, crop)
          .query(cropSql);
      }
    }

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({ message: "successful" });
  } catch (err) {
    console.error("Error: " + err.message);
    res.status(500).json({ message: "An error occurred" });

    // Rollback the transaction in case of an error
    if (transaction) {
      transaction.rollback();
    }
  }
});

router.delete("/deleteAdmin/:id", async (req, res) => {
  const adminId = req.params.id;

  try {
    const pool = await setupDatabase();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const deleteCropsRequest = new sql.Request(transaction);
    deleteCropsRequest.input("adminId", sql.Int, adminId);
    await deleteCropsRequest.query(
      "DELETE FROM [2025_admin_crops] WHERE userId = @adminId"
    );

    const deleteAdminRequest = new sql.Request(transaction);
    deleteAdminRequest.input("adminId", sql.Int, adminId);
    await deleteAdminRequest.query(
      "DELETE FROM [2025_admin_registration_data] WHERE id = @adminId"
    );

    await transaction.commit();
    res.send("Admin and associated crops successfully deleted");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    console.error("Error deleting admin:", error);
    res.status(500).send("Failed to delete admin");
  }
});

router.get("/adminDetails", async (req, res) => {
  const { adminId } = req.query; // Assuming the admin ID is passed as a query parameter

  if (!adminId) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  try {
    const pool = await setupDatabase();
    const request = pool.request();

    // Add parameters to your SQL query
    request.input("adminId", sql.Int, adminId);

    const result = await request.query(
      "SELECT * FROM [2025_admin_registration_data] WHERE id = @adminId"
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(result.recordset[0]); // Send the admin details
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
