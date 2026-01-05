const sql = require("mssql");

// Create a MSSQL connection pool
const testConfig = {
  server: "sql-ent.db.ifas.ufl.edu",
  database: "ABE_STEP",
  user: "if-svc-ABE_STEPwebuser",
  password: "W?6Xiv$A&ZaQ[]h",
  options: {
    encrypt: true,
    trustServerCertificate: false // true only if you get cert errors
  }
};

async function setupDatabase() {
  try {
    // Establish a connection pool
    const pool = await sql.connect(testConfig);
    console.log("Connected to MSSQL database");

    // Your table creation logic here...

    return pool;
  } catch (err) {
    console.error("Database connection error: " + err.message);
    throw err; // Rethrow the error after logging
  }
}




module.exports = { setupDatabase };



