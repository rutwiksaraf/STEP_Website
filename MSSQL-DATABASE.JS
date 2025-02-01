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

    // Your table creation logic here...
    await createTables(pool);

    return pool;
  } catch (err) {
    console.error("Database connection error: " + err.message);
    throw err; // Rethrow the error after logging
  }
}

async function createTables(pool) {
  try {
    await pool.request().query(`
    ALTER ROLE db_ddladmin ADD MEMBER [if-svc-ABE_STEP_testwebuser];
  `);
    // Example: Create 'corn_registration_data' table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'corn_registration_data')
      BEGIN
        CREATE TABLE corn_registration_data (
          id INT PRIMARY KEY IDENTITY(1,1),
          teamName VARCHAR(255) NOT NULL,
          cropType VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          captainFirstName VARCHAR(255) NOT NULL,
          captainLastName VARCHAR(255) NOT NULL,
          address1 VARCHAR(255) NOT NULL,
          address2 VARCHAR(255) NULL,
          city VARCHAR(255) NULL,
          state VARCHAR(255) NULL,
          zipCode VARCHAR(255) NULL,
          country VARCHAR(255) NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(255) NOT NULL
        )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'corn_team_members')
      BEGIN
      CREATE TABLE corn_team_members (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        FOREIGN KEY (teamId) REFERENCES corn_registration_data(id)
        )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_registration_data')
      BEGIN
      CREATE TABLE cotton_registration_data (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        cropType VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        captainFirstName VARCHAR(255) NOT NULL,
        captainLastName VARCHAR(255) NOT NULL,
        address1 VARCHAR(255) NOT NULL,
        address2 VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zipCode VARCHAR(255),
        country VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_team_members')
      BEGIN
      CREATE TABLE cotton_team_members (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        FOREIGN KEY (teamId) REFERENCES cotton_registration_data(id)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'admin_registration_data')
      BEGIN
      CREATE TABLE admin_registration_data (
        id INT PRIMARY KEY IDENTITY(1,1),
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        superuser VARCHAR(255)

      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'admin_crops')
      BEGIN
      CREATE TABLE admin_crops (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (userId) REFERENCES admin_registration_data(id)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'corn_hybrid_form')
      BEGIN
      CREATE TABLE corn_hybrid_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        hybrid VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        notes TEXT
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_hybrid_form')
      BEGIN
      CREATE TABLE cotton_hybrid_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        hybrid VARCHAR(255) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        notes TEXT
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'seeding_rate_form')
      BEGIN
      CREATE TABLE IF NOT EXISTS seeding_rate_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        seedingRate VARCHAR(255) NOT NULL,
        notes TEXT,
        submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_seeding_rate_form')
      BEGIN
      CREATE TABLE cotton_seeding_rate_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        seedingRate VARCHAR(255) NOT NULL,
        notes TEXT,
        submissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'nitrogen_management_form')
      BEGIN
      CREATE TABLE nitrogen_management_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        placement VARCHAR(255),
        date DATE NOT NULL,
        amount VARCHAR(255) NOT NULL,
        applied VARCHAR(255),
        dateToday VARCHAR(255)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_nitrogen_management_form')
      BEGIN
      CREATE TABLE cotton_nitrogen_management_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        placement VARCHAR(255),
        date DATE NOT NULL,
        amount VARCHAR(255) NOT NULL,
        applied VARCHAR(255),
        dateToday VARCHAR(255)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'ApplicationConfirmations')
      BEGIN
      CREATE TABLE ApplicationConfirmations (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        isConfirmed BOOLEAN NOT NULL
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'IrrigationApplicationConfirmations')
      BEGIN
      CREATE TABLE IrrigationApplicationConfirmations (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        isConfirmed BOOLEAN NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'MoistureApplicationConfirmations')
      BEGIN
      CREATE TABLE MoistureApplicationConfirmations (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        isConfirmed BOOLEAN NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'CottonApplicationConfirmations')
      BEGIN
      CREATE TABLE CottonApplicationConfirmations (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        applicationType VARCHAR(255) NOT NULL,
        isConfirmed BOOLEAN NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'soil_moisture_sensor_data')
      BEGIN
      CREATE TABLE soil_moisture_sensor_data (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        sensorType VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        reading VARCHAR(255) NOT NULL,
        options VARCHAR(255) NOT NULL,
        applied VARCHAR(255),
        dateToday VARCHAR(255)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_soil_moisture_sensor_data')
      BEGIN
      CREATE TABLE cotton_soil_moisture_sensor_data (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        sensorType VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        reading VARCHAR(255) NOT NULL,
        options VARCHAR(255) NOT NULL,
        applied VARCHAR(255),
        dateToday VARCHAR(255)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'insurance_selection_form')
      BEGIN
      CREATE TABLE insurance_selection_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        coverage VARCHAR(255) NOT NULL,
        level VARCHAR(255) NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_insurance_selection_form')
      BEGIN
      CREATE TABLE cotton_insurance_selection_form (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        coverage VARCHAR(255) NOT NULL,
        level VARCHAR(255) NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'marketing_options')
      BEGIN
      CREATE TABLE marketing_options (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        contractType VARCHAR(255) NOT NULL,
        quantityBushels VARCHAR(255) NOT NULL,
        complete VARCHAR(255) NOT NULL,
        completedon VARCHAR(255),
        submitteddate VARCHAR(255)
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_marketing_options')
      BEGIN
      CREATE TABLE cotton_marketing_options (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        contractType VARCHAR(255) NOT NULL,
        quantityBushels VARCHAR(255) NOT NULL,
        complete VARCHAR(255) NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'cotton_growth_regulation')
      BEGIN
      CREATE TABLE cotton_growth_regulation (
        id INT PRIMARY KEY IDENTITY(1,1),
        teamName VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        regulator VARCHAR(255) NOT NULL,
        rate VARCHAR(255) NOT NULL
      )
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'password_reset_tokens')
      BEGIN
      CREATE TABLE password_reset_tokens (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId INT NOT NULL,
        userType VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires BIGINT NOT NULL
      )
      END
    `);

    // Repeat similar blocks for each table you need to create, adapting the SQL syntax as needed for MSSQL.

    console.log("All tables created successfully");
  } catch (err) {
    console.error("Error creating tables: " + err.message);
    throw err;
  }
}

module.exports = { setupDatabase };
