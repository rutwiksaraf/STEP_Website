const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Add this line
const cors = require("cors");
const { setupDatabase } = require("./database");
const registrationRoute = require("./registration"); // Import the registration route
const loginRoute = require("./login");
const cornHybridFormRoute = require("./cornhybridform");
const cottonHybridFormRoute = require("./cottonhybridform");
const seedingRateFormRouter = require("./cornseedingform");
const cottonSeedingRateFormRouter = require("./cottonseedingform");
const nitrogenmanagementRoute = require("./corn_nitrogenmanagementform");
const cottonnitrogenmanagementRoute = require("./cotton_nitrogenmanagementform");
const irrigationmanagementroute = require("./corn_irrigationmanagementroute");
const cottonirrigationmanagementroute = require("./cotton_irrigationmanagementroute");
const insuranceselectionroute = require("./corn_insuranceselectionroute");
const cottoninsuranceselectionroute = require("./cotton_insuranceselectionroute");
const marketingoptionsroute = require("./corn_marketingoptionsroute");
const cottonmarketingoptionsroute = require("./cotton_marketingoptionsroute");
const cottongrowthregulationroute = require("./cotton_growthregulation");
const adminuserdata = require("./admin_fetch_user_details");
const session = require("express-session");
const fileUploadRoutes = require("./fileUploadRoutes"); // Import the file upload routes
const bulletin = require("./corn_bulletin");
const cottonbulletin = require("./cotton_bulletin");
const admindata = require("./admin_data");
const fetchadmin = require("./fetch_admin");
require("dotenv").config();
const authenticateToken = require("./authenticateToken");
const sql = require("mssql");

const app = express();
const port = 3000;

app.use(
  session({
    secret: "vishesha", // Replace with a strong and unique secret key
    resave: false,
    saveUninitialized: true,
  })
);

setupDatabase()
  .then(() => {
    console.log("Database tables created successfully");
  })
  .catch((error) => {
    console.error("Error setting up database:", error);
    process.exit(1); // Exit the application on error
  });

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the registration route
app.use("/api", registrationRoute);
app.use("/api", loginRoute);
// app.use(authenticateToken);
app.use("/api", cornHybridFormRoute);
app.use("/api", cottonHybridFormRoute);
app.use("/api", seedingRateFormRouter);
app.use("/api", cottonSeedingRateFormRouter);
app.use("/api", nitrogenmanagementRoute);
app.use("/api", cottonnitrogenmanagementRoute);
app.use("/api", irrigationmanagementroute);
app.use("/api", cottonirrigationmanagementroute);
app.use("/api", insuranceselectionroute);
app.use("/api", cottoninsuranceselectionroute);
app.use("/api", marketingoptionsroute);
app.use("/api", cottonmarketingoptionsroute);
app.use("/api", cottongrowthregulationroute);
app.use("/api", adminuserdata);
app.use("/api", fileUploadRoutes);
app.use("/api", bulletin);
app.use("/api", cottonbulletin);
app.use("/api", admindata);
app.use("/api", fetchadmin);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
