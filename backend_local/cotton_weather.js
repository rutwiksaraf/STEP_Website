const express = require("express");
const axios = require("axios");
const router = express.Router();
const sql = require("mssql");
const { setupDatabase } = require("./database");

const FAWN_WEATHER_API_URL =
  "https://fawn.ifas.ufl.edu/controller.php/week/obs/110;json";
const FAWN_ET_API_BASE_URL =
  "https://fawn.ifas.ufl.edu/controller.php/fiveDaysETsJson/test/";

  const COTTON_WEATHER_API_FORECAST_URL =
  "https://api.weatherapi.com/v1/forecast.json?key=3e5a549504c14d44927192432250502&q=32565&days=7";



// Function to get the date 6 days before today in YYYY-MM-DD format
const cottonGetPastDate = (daysBefore) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBefore);
  return date.toISOString().split("T")[0];
};

// Fetch regular weather data
const cottonFetchWeatherData = async () => {
  try {
    const response = await axios.get(FAWN_WEATHER_API_URL);
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid weather API response format");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching FAWN weather data:", error.message);
    return null;
  }
};

// Fetch ET data for the last 5 days
const cottonFetchETData = async () => {
  const targetDate = cottonGetPastDate(5);
  const etApiUrl = `${FAWN_ET_API_BASE_URL}${targetDate}`;

  try {
    const response = await axios.get(etApiUrl);
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid ET API response format");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching FAWN ET data:", error.message);
    return null;
  }
};

// Function to aggregate weather data
const cottonAggregateWeatherData = async () => {
  const weatherData = await cottonFetchWeatherData();
  const etData = await cottonFetchETData();

  if (!weatherData || !etData) {
    throw new Error("Failed to fetch weather or ET data");
  }

  const dailyData = {};
  weatherData.forEach((record) => {
    const date = record.endTime.split("T")[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        rain: 0,
        rfd: 0,
        tsoil: 0,
        rh: 0,
        ws: 0,
        t2m: 0,
        count: 0,
        et: null,
      };
    }
    dailyData[date].rain += Number(record.rain) || 0;
    dailyData[date].rfd += Number(record.rfd) || 0;
    dailyData[date].tsoil += Number(record.tsoil) || 0;
    dailyData[date].rh += Number(record.rh) || 0;
    dailyData[date].ws += Number(record.ws) || 0;
    dailyData[date].t2m += Number(record.t2m) || 0;
    dailyData[date].count++;
  });

  // Retrieve ET data for the specific station
  const stationId = "110"; // Replace with actual station ID if dynamic
  if (etData[stationId]) {
    Object.entries(etData[stationId]).forEach(([date, etValue]) => {
      if (dailyData[date]) {
        dailyData[date].et = parseFloat(etValue);
      }
    });
  }

  // Format response
  return Object.entries(dailyData).map(([date, values]) => ({
    date,
    rain: values.rain,
    rfd: values.rfd / values.count,
    tsoil: values.tsoil / values.count,
    rh: values.rh / values.count,
    ws: values.ws / values.count,
    t2m: values.t2m / values.count,
    et: values.et, // Include ET data
  }));
};

router.post("/savecottonweatherdatatodb", async (req, res) => {

  const pool = await setupDatabase(); // Obtain a connection pool
  const transaction = new sql.Transaction(pool);
  
  try {
     // Create a transaction
    await transaction.begin(); // Begin transaction

    const aggregatedData = await cottonAggregateWeatherData(); // Aggregate weather data

    for (const data of aggregatedData) {
      console.log("Inserting data:", data);
      const request = new sql.Request(transaction); // Use the transaction for each request

      request.input("date", sql.Date, data.date);
      request.input("rain", sql.Float, data.rain);
      request.input("rfd", sql.Float, data.rfd);
      request.input("tsoil", sql.Float, data.tsoil);
      request.input("rh", sql.Float, data.rh);
      request.input("ws", sql.Float, data.ws);
      request.input("t2m", sql.Float, data.t2m);
      request.input("et", sql.Float, data.et);

      await request.query(`
        IF EXISTS (
          SELECT 1 FROM [2025_cotton_weather_data] WHERE date = @date
        )
        BEGIN
          UPDATE [2025_cotton_weather_data]
          SET rain = @rain,
              rfd = @rfd,
              tsoil = @tsoil,
              rh = @rh,
              ws = @ws,
              et = @et,
              t2m = @t2m
          WHERE date = @date
        END
        ELSE
        BEGIN
          INSERT INTO [2025_cotton_weather_data] (date, rain, rfd, tsoil, rh, ws, et, t2m)
          VALUES (@date, @rain, @rfd, @tsoil, @rh, @ws, @et, @t2m)
        END
      `);
    }
 // Commit the transaction after all queries succeed
    res.status(200).json({
      message: "Aggregated weather data submitted successfully",
    });
    await transaction.commit();
    
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction if an error occurs
    console.error("Error submitting aggregated weather data:", error);
    res
      .status(500)
      .json({
        message: "Failed to submit aggregated weather data",
        error: error.message,
      });
  }
});

// API endpoint to get aggregated weather data including ET
router.get("/cottonweather", async (req, res) => {
  try {
    const aggregatedData = await cottonAggregateWeatherData();
    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

router.get("/cottonweatherfromdb", async (req, res) => {
  try {
    const pool = await setupDatabase();
    const request = new sql.Request(pool);

    // Query to fetch all weather data
    const result = await request.query(
      "SELECT * FROM [2025_cotton_weather_data] ORDER BY date DESC"
    );

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching weather data from DB:", error.message);
    res
      .status(500)
      .json({
        message: "Failed to fetch weather data from DB",
        error: error.message,
      });
  }
});

const fetchCottonForecastData = async () => {
  try {
    const response = await axios.get(COTTON_WEATHER_API_FORECAST_URL);
    const forecastDays = response.data.forecast.forecastday;

    const formattedForecast = forecastDays.map((day) => ({
      date: day.date,
      avgtemp_f: day.day.avgtemp_f,
      totalprecip_in: day.day.totalprecip_in,
      avghumidity: day.day.avghumidity,
      maxwind_mph: day.day.maxwind_mph,
    }));

    return formattedForecast;
  } catch (error) {
    console.error("Error fetching forecast data:", error.message);
    return null;
  }
};

// Add a new route to get forecast data
router.get("/cottonweatherforecast", async (req, res) => {
  try {
    const forecastData = await fetchCottonForecastData();

    if (!forecastData) {
      return res.status(500).json({ message: "Failed to fetch forecast data" });
    }

    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error in /weatherforecast route:", error);
    res.status(500).json({ message: "Server error fetching forecast" });
  }
});


module.exports = router;
