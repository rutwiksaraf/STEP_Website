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
const weather = require("./corn_weather")
const cottonweather = require("./cotton_weather")
const cottonbulletin = require("./cotton_bulletin");
const admindata = require("./admin_data");
const fetchadmin = require("./fetch_admin");
require("dotenv").config();
const authenticateToken = require("./authenticateToken");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 3002;

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
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the registration route
app.use("/api", registrationRoute);
app.use("/api", loginRoute);
// app.use(authenticateToken);
app.use("/api", authenticateToken, cornHybridFormRoute);
app.use("/api", authenticateToken, cottonHybridFormRoute);
app.use("/api", authenticateToken, seedingRateFormRouter);
app.use("/api", authenticateToken, cottonSeedingRateFormRouter);
app.use("/api", authenticateToken, nitrogenmanagementRoute);
app.use("/api", authenticateToken, cottonnitrogenmanagementRoute);
app.use("/api", authenticateToken, irrigationmanagementroute);
app.use("/api", authenticateToken, cottonirrigationmanagementroute);
app.use("/api", authenticateToken, insuranceselectionroute);
app.use("/api", authenticateToken, cottoninsuranceselectionroute);
app.use("/api", authenticateToken, marketingoptionsroute);
app.use("/api", authenticateToken, cottonmarketingoptionsroute);
app.use("/api", authenticateToken, cottongrowthregulationroute);
app.use("/api", authenticateToken, adminuserdata);
app.use("/api", authenticateToken, fileUploadRoutes);
app.use("/api", authenticateToken, bulletin);
app.use("/api", authenticateToken, weather);
app.use("/api", authenticateToken, cottonweather);
app.use("/api", authenticateToken, cottonbulletin);
app.use("/api", authenticateToken, admindata);
app.use("/api", authenticateToken, fetchadmin);

if (process.env.NODE_ENV !== "development") {
  const clientpath = require("path");

  app.use(express.static(clientpath.join(__dirname, "build/"))); //path to your build directory
  // Handles any requests that don't match the ones above and send them to react client build
  app.get("*", (req, res) => {
    res.sendFile(clientpath.join(__dirname + "/build/index.html"));
  });
}

// Start the server
module.exports = app;
