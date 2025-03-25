import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const token = localStorage.getItem("token");

const PARAMETERS = {
  rain: "Rainfall (in)",
  rfd: "Radiation Flux Density (W/m²)",
  tsoil: "Soil Temperature (°C)",
  rh: "Humidity (%)",
  ws: "Wind Speed (m/s)",
  et: "Evapotranspiration (in)",
};

const COLORS = {
  rain: "#99ccff",
  rfd: "#FF8C00",
  tsoil: "#FFD700",
  rh: "#FF1493",
  ws: "#FF4500",
  et: "#32CD32",
};

const WeatherGraph = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedParam, setSelectedParam] = useState("rain");
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [weatherDataFromDB, setWeatherDataFromDB] = useState([]);
  const [dbChartData, setDbChartData] = useState(null);
  const [dbTableData, setDbTableData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`/api/weather`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data", error);
      }
    };

    const fetchWeatherDataFromDB = async () => {
      try {
        const response = await axios.get(`/api/weatherfromdb`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeatherDataFromDB(response.data);
      } catch (error) {
        console.error("Error fetching weather data from DB", error);
      }
    };

    fetchWeatherData();
    fetchWeatherDataFromDB();
  }, []);

  useEffect(() => {
    if (weatherData.length === 0) return;

    const formatDate = (dateString) =>
      new Date(dateString).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
      });

    const labels = weatherData.map((entry) => formatDate(entry.date));
    const dataPoints = weatherData.map((entry) =>
      entry[selectedParam] != null ? entry[selectedParam].toFixed(2) : 0
    );

    setChartData({
      labels,
      datasets: [
        {
          label: PARAMETERS[selectedParam],
          data: dataPoints,
          backgroundColor: selectedParam === "rain" ? "#99ccff" : "transparent",
          borderColor: COLORS[selectedParam] || "#99ccff",
          borderWidth: 2,
          fill: selectedParam !== "rain",
          tension: 0,
        },
      ],
    });

    if (weatherDataFromDB.length > 0) {
      const dbLabels = weatherDataFromDB.map((entry) => formatDate(entry.date));
      const dbDataPoints = weatherDataFromDB.map((entry) =>
        entry[selectedParam] != null ? entry[selectedParam].toFixed(2) : 0
      );

      setDbChartData({
        labels: dbLabels,
        datasets: [
          {
            label: `DB: ${PARAMETERS[selectedParam]}`,
            data: dbDataPoints,
            backgroundColor:
              selectedParam === "rain" ? "#99ccff" : "transparent",
            borderColor: COLORS[selectedParam] || "#99ccff",
            borderWidth: 2,
            fill: selectedParam !== "rain",
            tension: 0,
          },
        ],
      });

      setDbTableData(
        dbLabels.map((date, index) => ({ date, value: dbDataPoints[index] }))
      );
    }

    setTableData(
      labels.map((date, index) => ({ date, value: dataPoints[index] }))
    );
  }, [selectedParam, weatherData, weatherDataFromDB]);

  const chartScrollRef = useRef(null);

  useEffect(() => {
    if (chartScrollRef.current) {
      chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
    }
  }, [dbChartData]);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    layout: { padding: { right: 20 } },
    scales: {
      x: {
        reverse: true,
        ticks: {
          font: { size: 20 },
          autoSkip: false,
          maxRotation: 0,
          padding: 10,
          maxTicksLimit: 7,
        },
        title: { display: true, text: "Date", font: { size: 30 } },
      },
      y: {
        ticks: { font: { size: 20 } },
        title: {
          display: true,
          text: PARAMETERS[selectedParam],
          font: { size: 30 },
        },
      },
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
          marginTop: "20px",
        }}
      >
        {Object.keys(PARAMETERS).map((param) => (
          <div
            key={param}
            onClick={() => setSelectedParam(param)}
            style={{
              cursor: "pointer",
              padding: "10px 16px",
              backgroundColor: selectedParam === param ? "#fa4616" : "#F5F5F5",
              border:
                selectedParam === param
                  ? "2px solid rgb(255, 255, 255)"
                  : "2px solid rgb(37, 106, 185)",
              borderRadius: "12px",
              color: selectedParam === param ? "white" : "#333",
              boxShadow:
                selectedParam === param
                  ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                  : "none",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "50px",
            }}
          >
            <span>{PARAMETERS[param]}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "start",
          gap: "20px",
          width: "100%",
          maxHeight: "500px",
        }}
      >
        {/* DB Chart Container */}
        {dbChartData && (
          <div
            ref={chartScrollRef}
            style={{
              flexGrow: 1,
              minWidth: "800px",
              height: "500px",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                width: `${dbChartData.labels.length * 100}px`,
                height: "100%",
              }}
            >
              {selectedParam === "rain" ? (
                <Bar data={dbChartData} options={chartOptions} />
              ) : (
                <Line data={dbChartData} options={chartOptions} />
              )}
            </div>
          </div>
        )}

        {/* DB Data Table Container */}
        <div
          style={{
            width: "500px",
            height: "500px",
            overflowY: "auto",
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h3
            style={{ fontSize: "24px", fontWeight: "bold", color: "#002657" }}
          >
            {PARAMETERS[selectedParam]}
          </h3>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#002657", color: "white" }}>
                <th style={{ padding: "10px" }}>Date</th>
                <th style={{ padding: "10px" }}>{PARAMETERS[selectedParam]}</th>
              </tr>
            </thead>
            <tbody>
              {dbTableData.map((entry, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {entry.date}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {entry.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherGraph;

{
  /* <div
        style={{
          display: "flex",
          alignItems: "start",
          gap: "20px",
          width: "100%",
        }}
      >
        <div style={{ flexGrow: 1, minWidth: "800px", height: "500px" }}>
          {chartData ? (
            selectedParam === "rain" ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div
          style={{
            width: "400px",
            maxHeight: "500px",
            overflowY: "auto",
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h3
            style={{ fontSize: "24px", fontWeight: "bold", color: "#002657" }}
          >
            {PARAMETERS[selectedParam]}
          </h3>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#002657", color: "white" }}>
                <th
                  style={{
                    border: "1px solid",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {PARAMETERS[selectedParam]}
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {entry.date}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {entry.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */
}
