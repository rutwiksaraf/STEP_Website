const sql = require("mssql");

// Create a MySQL connection pool
const testConfig = {
  user: "if-svc-ABE_STEP_testwebuser",
  password: "X!TH+j|+q&QFjcR",
  server: "sql-dev.ifas.ufl.edu",
  database: "ABE_STEP_test",
  pool: {
    max: 100,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Change to false for production
  },
};

async function setupDatabase() {
  try {
    // Establish a connection pool
    const pool = await sql.connect(testConfig);
    console.log("Connected to MSSQL database");

    return pool;
  } catch (err) {
    console.error("Database connection error: " + err.message);
    throw err; // Rethrow the error after logging
  }
}

module.exports = { setupDatabase };
