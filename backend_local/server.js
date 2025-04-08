#!/usr/bin/env node

//Module dependencies.
var app = require("./app");
var https = require("https");
var fs = require("fs");
var http = require("http");
var debug = require("debug")("plantmgn:server");
const cron = require("node-cron");
const axios = require("axios");



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

//read in ssl certificate
// var key = fs.readFileSync('certs/key.pem');
// var cert = fs.readFileSync('certs/cert.pem');

// var options = {
//   key: key,
//   cert: cert,
//   requestCert: false,
//   rejectUnauthorized: false
// };

// Creat HTTPS server.s
// var server = https.createServer(options, app);

// Creat HTTP server.
var server = http.createServer(app);



server.on("clientError", (err, socket) => {
  socket.end("400 Bad Request\r\n\r\n");
  console.log("ATTENTION!!!! HTTP/1.1 400 Bad Request: ", err);
});

server.listen(port, function () {
  debug("Express server listening on port " + server.address().port);
});


server.on("error", onError);
server.on("listening", onListening);

// Define the function to call your weather API
const triggerSaveWeatherData = async () => {
  try {
    const response = await axios.post(
      "https://step-app.ifas.ufl.edu/api/saveweatherdatatodb",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Weather data saved:", response.data.message);
  } catch (error) {
    console.error("Error saving weather data:", error.message);
  }
};

// Call once immediately when server starts (for testing)
// triggerSaveWeatherData();

// Then schedule it to run once every day at 6 AM server time
cron.schedule("0 6 * * *", () => {
  console.log("🔁 Running scheduled weather data save...");
  triggerSaveWeatherData();
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

