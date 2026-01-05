const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function
const sql = require("mssql");

router.get("/getAdmin", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool

    // Query to fetch admin data
    const adminResults = await pool
      .request()
      .query("SELECT * FROM [2025_admin_registration_data]");

    // Loop through each admin to fetch their crops
    const fetchCropsPromises = adminResults.recordset.map(async (admin) => {
      const cropsResult = await pool
        .request()
        .input("userId", sql.Int, admin.id)
        .query("SELECT * FROM [2025_admin_crops] WHERE userId = @userId");
      return { ...admin, crops: cropsResult.recordset };
    });

    // Resolve all promises and send the response
    const results = await Promise.all(fetchCropsPromises);
    res.json(results);
  } catch (error) {
    console.error("Error fetching admin data or crops:", error);
    res.status(500).json({ message: "Error fetching admin data or crops" });
  }
});

module.exports = router;
