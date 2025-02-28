const express = require("express");
const session = require("express-session"); // Import the express-session middleware
const router = express.Router();
const jwt = require("jsonwebtoken");
const { setupDatabase } = require("./database"); // Import the setupDatabase function
const sql = require("mssql");
const secretKey = "step_website";
const bcrypt = require("bcrypt");
// Login API

router.post("/login", async (req, res) => {
  const { username, password, cropType } = req.body;

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    let request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, username);

    let loginSql;

    // Define SQL statement to select user based on cropType
    if (cropType === "corn") {
      loginSql =
        "SELECT * FROM corn_registration_data WHERE teamName = @teamName";
    } else if (cropType === "cotton") {
      loginSql =
        "SELECT * FROM cotton_registration_data WHERE teamName = @teamName";
    } else {
      return res.status(400).json({ message: "Unsupported crop type" });
    }

    // Query the database to check if the user exists
    const result = await request.query(loginSql);

    if (result.recordset.length === 0) {
      // No user found with the given username
      return res
        .status(401)
        .json({ message: "Invalid credentials. User does not exist." });
    }

    // User found, check password (ensure you use hashed passwords in production)
    const user = result.recordset[0];
    if (user.password === password) {
      // Replace with password comparison using bcrypt in production
      // Successful login
      const token = jwt.sign(
        { username: user.teamName, cropType: cropType },
        secretKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      // Removing the password from the user object before sending it
      delete user.password;

      res.status(200).json({
        message: "Login successful",
        user: user,
        token: token,
      });
    } else {
      // Password does not match
      res.status(401).json({
        message: "Invalid credentials. Please check your password.",
      });
    }
  } catch (err) {
    console.error("Error during login query: " + err.message);
    res.status(500).json({ message: "Login query failed" });
  }
});

router.post("/adminlogin", async (req, res) => {
  const { username, password, cropType } = req.body;

  // Step 1: Validate input
  if (!username || !password || !cropType) {
    return res
      .status(400)
      .json({ message: "Username, password, and crop are required" });
  }

  // Step 2: Check if the user exists in the database and the crop type matches
  try {
    const pool = await setupDatabase(); // Ensure setupDatabase returns a connected SQL Server pool or connection
    const request = pool.request();

    // Add parameters to your SQL query
    request.input("username", sql.VarChar, username);
    request.input("cropType", sql.VarChar, cropType);

    // Step 2: Check if the user exists in the database and the crop type matches
    const query = `
      SELECT admin.*, crop.name AS cropName 
      FROM admin_registration_data admin
      INNER JOIN admin_crops crop ON admin.id = crop.userId
      WHERE admin.username = @username AND crop.name = @cropType
    `;

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    // Step 3: Compare the hashed password
    try {
      if (await bcrypt.compare(password, user.password)) {
        // Passwords and crop type match
        // Generate a token if using JWT
        const accessToken = jwt.sign(
          { username: user.username, id: user.id },
          secretKey,
          { expiresIn: "1h" } // Token expires in 1 hour
        );

        return res
          .status(200)
          .json({ message: "Login successful", accessToken: accessToken });
      } else {
        // Passwords do not match
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (compareError) {
      console.error("Password compare error: " + compareError.message);
      return res
        .status(500)
        .json({ message: compareError.message + "Internal server error" });
    }
  } catch (err) {
    console.error("Error during login: " + err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/superadminlogin", async (req, res) => {
  const { username, password, cropType } = req.body;

  // Step 1: Validate input

  // Step 2: Check if the user exists in the database and the crop type matches
  try {
    const accessToken = jwt.sign(
      { username: username, cropType: "All" },
      secretKey,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    console.log(accessToken);
    return res
      .status(200)
      .json({ message: "Login successful", accessToken: accessToken });
  } catch (err) {
    console.error("Error during login: " + err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

// ... Other routes ...
