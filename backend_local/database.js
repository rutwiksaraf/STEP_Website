const sql = require("mssql");

// Create a MSSQL connection pool
const testConfig = {
  server: "sql-ent.ifas.ufl.edu",
  database: "ABE_STEP",
  authentication: {
    type: "ntlm",  // Change to 'ntlm' for Windows Authentication
    options: {
      domain: "UFAD", // Specify your domain here
      userName: "rutwiksaraf",  // Optional: Specify username if needed
      password: "rutwikrutujasurekha3#7$",  // Optional: Specify password if needed
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
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



