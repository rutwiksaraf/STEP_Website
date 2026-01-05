const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

router.get("/cottonGetContractPrices", async (req, res) => {

  try {
      const pool = await setupDatabase();
      const request = pool.request();
  
      const result = await request.query(`
        SELECT * FROM [2025_cotton_marketing_prices]
      `);
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error("Error fetching growth regulation data:", error);
      res.status(500).json({ message: "Error fetching data" });
    }
});

router.post("/cottonAddContractPrices", async (req, res) => {
  const { contractPrice, date } = req.body;

  if (!contractPrice || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const pool = await setupDatabase();
    const request = pool.request();

    request.input("contractPrice", sql.Decimal(18, 2), contractPrice);
    request.input("date", sql.DateTime, date);

    await request.query(`
      INSERT INTO [2025_cotton_marketing_prices] (contractPrice, date)
      VALUES ( @contractPrice, @date)
    `);

    res.status(201).json({ message: "Contract price added successfully" });
  } catch (error) {
    console.error("Error adding contract price:", error);
    res.status(500).json({ message: "Error adding contract price" });
  }
});

module.exports = router;