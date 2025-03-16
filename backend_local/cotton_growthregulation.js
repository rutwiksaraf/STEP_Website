const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Create the [2025_cotton_growth_regulation] table if it doesn't exist
// router.get("/createCottonGrowthRegulationTable", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       db.query(createCottonGrowthRegulationTable, (error) => {
//         if (error) {
//           console.error("Error creating table:", error);
//           res.status(500).json({ message: "Error creating table" });
//         } else {
//           res.status(200).json({ message: "Table created successfully" });
//         }
//       });
//       db.release();
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

// Define a route for inserting growth regulation data
// router.post("/cottonInsertGrowthRegulation", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract data from the request body
//         const { teamName, date, regulator, rate } = req.body;

//         // Insert a new growth regulation record
//         const insertQuery =
//           "INSERT INTO [2025_cotton_growth_regulation] (teamName, date, regulator, rate) VALUES (?, ?, ?, ?)";
//         db.query(
//           insertQuery,
//           [teamName, date, regulator, rate],
//           (insertError) => {
//             if (insertError) {
//               console.error(
//                 "Error inserting growth regulation data into the database:",
//                 insertError
//               );
//               res.status(500).json({ message: "Data insertion failed" });
//             } else {
//               res.status(200).json({
//                 message: "Data inserted successfully",
//               });
//             }
//           }
//         );
//         db.release();
//       } catch (error) {
//         console.error(
//           "Error handling growth regulation data insertion:",
//           error
//         );
//         res.status(500).json({ message: "Internal server error" });
//         db.release();
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

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
      INSERT INTO 2025_[2025_cotton_growth_regulation] (teamName, date, regulator, rate)
      VALUES (@teamName, @date, @regulator, @rate)
    `);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting growth regulation data:", error);
    res.status(500).json({ message: "Data insertion failed" });
  }
});

// Define a route for fetching growth regulation data
// router.get("/cottonFetchGrowthRegulation", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract the teamName from the query parameters
//         const { teamName } = req.query;

//         // Query the database to fetch all growth regulation data for the specified teamName
//         const query =
//           "SELECT * FROM [2025_cotton_growth_regulation] WHERE teamName = ?";
//         db.query(query, [teamName], (error, results) => {
//           if (error) {
//             console.error("Error fetching growth regulation data:", error);
//             res.status(500).json({ message: "Error fetching data" });
//           } else {
//             // Send the fetched data as a JSON response
//             res.status(200).json(results);
//           }
//         });
//         db.release();
//       } catch (error) {
//         console.error("Error handling growth regulation data fetch:", error);
//         res.status(500).json({ message: "Internal server error" });
//         db.release();
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

router.get("/cottonFetchGrowthRegulation", async (req, res) => {
  const { teamName } = req.query;
  try {
    const pool = await setupDatabase();
    const request = pool.request();
    request.input("teamName", sql.VarChar, teamName);

    const result = await request.query(`
      SELECT * FROM 2025_[2025_cotton_growth_regulation] WHERE teamName = @teamName
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching growth regulation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// router.get("/cottonFetchAllGrowthRegulation", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract the teamName from the query parameters

//         // Query the database to fetch all growth regulation data for the specified teamName
//         const query = "SELECT * FROM [2025_cotton_growth_regulation]";
//         db.query(query, (error, results) => {
//           if (error) {
//             console.error("Error fetching growth regulation data:", error);
//             res.status(500).json({ message: "Error fetching data" });
//           } else {
//             // Send the fetched data as a JSON response
//             res.status(200).json(results);
//           }
//         });
//         db.release();
//       } catch (error) {
//         console.error("Error handling growth regulation data fetch:", error);
//         res.status(500).json({ message: "Internal server error" });
//         db.release();
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

router.get("/cottonFetchAllGrowthRegulation", async (req, res) => {
  try {
    const pool = await setupDatabase();
    const result = await pool.request().query(`
      SELECT * FROM 2025_[2025_cotton_growth_regulation]
    `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching all growth regulation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;
