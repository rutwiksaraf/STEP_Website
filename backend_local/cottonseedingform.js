// backend/routes/seeding_rate_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");
const sql = require("mssql");

// Define a route for handling form submissions
// router.post("/cottonseedingratesubmit", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       try {
//         // Extract data from the request body and session
//         const { seedingRate, notes, teamName } = req.body;
//         // Assuming teamName is stored in the session

//         // Check if a row with the same teamName already exists in the database
//         const checkQuery =
//           "SELECT * FROM cotton_seeding_rate_form WHERE teamName = ?";
//         db.query(checkQuery, [teamName], (checkError, checkResult) => {
//           if (checkError) {
//             console.error("Error checking for existing row:", checkError);
//             res.status(500).json({ message: "Form submission failed" });
//             return;
//           }

//           if (checkResult.length === 0) {
//             // No existing row found, insert a new row
//             const insertQuery =
//               "INSERT INTO cotton_seeding_rate_form (teamName, seedingRate, notes) VALUES (?, ?, ?)";
//             db.query(
//               insertQuery,
//               [teamName, seedingRate, notes],
//               (insertError, insertResult) => {
//                 if (insertError) {
//                   console.error(
//                     "Error inserting form data into the database:",
//                     insertError
//                   );
//                   res.status(500).json({ message: "Form submission failed" });
//                 } else {
//                   res.status(200).json({
//                     message: "Form submitted successfully",
//                   });
//                 }
//               }
//             );
//           } else {
//             // Existing row found, update the row with new details
//             const updateQuery =
//               "UPDATE cotton_seeding_rate_form SET seedingRate = ?, notes = ? WHERE teamName = ?";
//             db.query(
//               updateQuery,
//               [seedingRate, notes, teamName],
//               (updateError, updateResult) => {
//                 if (updateError) {
//                   console.error(
//                     "Error updating form data in the database:",
//                     updateError
//                   );
//                   res.status(500).json({ message: "Form submission failed" });
//                 } else {
//                   res.status(200).json({
//                     message: "Form submitted successfully",
//                   });
//                 }
//               }
//             );
//           }
//         });
//         db.release();
//       } catch (error) {
//         console.error("Error handling form submission:", error);
//         res.status(500).json({ message: "Internal server error" });
//         db.release();
//       }
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

router.post("/cottonseedingratesubmit", async (req, res) => {
  const { seedingRate, notes, teamName } = req.body; // Extract data from the request body

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, teamName);
    request.input("seedingRate", sql.VarChar, seedingRate); // Use the appropriate SQL data type
    request.input("notes", sql.Text, notes); // Use the appropriate SQL data type

    // Check if a row with the same teamName already exists
    const checkResult = await request.query(
      "SELECT * FROM cotton_seeding_rate_form WHERE teamName = @teamName"
    );

    if (checkResult.recordset.length === 0) {
      // No existing row found, insert a new row
      await request.query(
        "INSERT INTO cotton_seeding_rate_form (teamName, seedingRate, notes) VALUES (@teamName, @seedingRate, @notes)"
      );
    } else {
      // Existing row found, update the row with new details
      await request.query(
        "UPDATE cotton_seeding_rate_form SET seedingRate = @seedingRate, notes = @notes WHERE teamName = @teamName"
      );
    }

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error handling form submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post("/getCottonseedingForms", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       // Extract the username from the request body
//       const { username } = req.body;

//       // Define the SQL query to fetch submitted forms data for the specified user
//       const fetchQuery =
//         "SELECT * FROM cotton_seeding_rate_form WHERE teamName = ?";

//       // Execute the query to fetch data
//       db.query(fetchQuery, [username], (error, result) => {
//         if (error) {
//           console.error("Error fetching submitted forms data:", error);
//           res.status(500).json({ message: "Failed to fetch data" });
//         } else {
//           // Send the fetched data as a JSON response
//           res.status(200).json(result);
//         }
//       });
//       db.release();
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

router.post("/getCottonseedingForms", async (req, res) => {
  const { username } = req.body; // Extract the username from the request body

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Add parameters to your SQL query
    request.input("teamName", sql.VarChar, username);

    // Define the SQL query to fetch submitted forms data for the specified user
    const result = await request.query(
      "SELECT * FROM cotton_seeding_rate_form WHERE teamName = @teamName"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching submitted forms data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

// router.get("/getAllCottonseedingForms", (req, res) => {
//   setupDatabase()
//     .then((db) => {
//       // Extract the username from the request body

//       // Define the SQL query to fetch submitted forms data for the specified user
//       const fetchQuery = "SELECT * FROM cotton_seeding_rate_form";

//       // Execute the query to fetch data
//       db.query(fetchQuery, (error, result) => {
//         if (error) {
//           console.error("Error fetching submitted forms data:", error);
//           res.status(500).json({ message: "Failed to fetch data" });
//         } else {
//           // Send the fetched data as a JSON response
//           res.status(200).json(result);
//         }
//       });
//       db.release();
//     })
//     .catch((err) => {
//       console.error("Database setup error: " + err.message);
//       res.status(500).json({ message: "Database setup error" });
//     });
// });

router.get("/getAllCottonseedingForms", async (req, res) => {
  try {
    const pool = await setupDatabase(); // Obtain a connection pool
    const request = pool.request(); // Create a new request object

    // Execute the query to fetch all submitted seeding forms
    const result = await request.query(
      "SELECT * FROM cotton_seeding_rate_form"
    );

    // Send the fetched data as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching submitted forms data:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
});

module.exports = router;
