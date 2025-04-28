const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");


router.post("/cottonInsertGrowthRegulation", async (req, res) => {
  const { teamName, date, regulator, rate } = req.body;
  try {
    const pool = await setupDatabase();
    const request = pool.request();
    request.input("teamName", sql.VarChar, teamName);
    request.input("date", sql.Date, date);
    request.input("regulator", sql.VarChar, regulator);
    request.input("rate", sql.VarChar, rate);

    await request.query(`
      INSERT INTO [2025_cotton_growth_regulation] (teamName, date, regulator, rate)
      VALUES (@teamName, @date, @regulator, @rate)
    `);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting growth regulation data:", error);
    res.status(500).json({ message: "Data insertion failed" });
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
      SELECT * FROM 2025_cotton_growth_regulation]
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching all growth regulation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;
