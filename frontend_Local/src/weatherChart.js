import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Legend, Tooltip } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

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
  PointElement,
  Legend,
  Tooltip,
  annotationPlugin
);

const token = localStorage.getItem("token");

const PARAMETERS = {
  rain: "Rainfall (in)",
  t2m: "Air Temperature (°F)",
  rh: "Humidity (%)",
  ws: "Wind Speed (mph)",
  et: "Evapotranspiration (in)",
  rfd: "Radiation Flux Density (W/m²)",
  gdd: "Growing Degree Days (°F)",
};

const forecastKeyMap = {
  t2m: "avgtemp_f",
  rain: "totalprecip_in",
  rh: "avghumidity",
  ws: "maxwind_mph",
};

const COLORS = {
  rain: "#99ccff",
  rfd: "#FF8C00",
  rh: "#FF1493",
  ws: "#FF4500",
  et: "#32CD32",
  t2m: "#1E90FF",
  gdd: "#228B22",
  cumulativeGdd: "#800080",
};

const WeatherGraph = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedParam, setSelectedParam] = useState("rain");
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [weatherDataFromDB, setWeatherDataFromDB] = useState([]);
  const [dbChartData, setDbChartData] = useState(null);
  const [dbTableData, setDbTableData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [forecastStartLabel, setForecastStartLabel] = useState(null);
  const [allChartLabels, setAllChartLabels] = useState([]);

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
    const fetchForecast = async () => {
      try {
        const res = await axios.get("/api/weatherforecast", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForecastData(res.data);
      } catch (err) {
        console.error("Error fetching forecast:", err);
      }
    };

    fetchForecast();
    fetchWeatherData();
    fetchWeatherDataFromDB();
  }, []);

  useEffect(() => {
    if (weatherData.length === 0) return;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      date.setDate(date.getDate() + 1); // shift the *whole date* forward by one day
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${month}/${day}`;
    };

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

    if (selectedParam === "gdd") {
      const forecastDates = forecastData.map((entry) => formatDate(entry.date));

      const reversed = [...weatherDataFromDB].reverse();
      let cumulative = 0;

      const filteredLabels = [];
      const gddPoints = [];
      const cumulativePoints = [];

      reversed.forEach((entry) => {
        const dateLabel = formatDate(entry.date);
        if (!forecastDates.includes(dateLabel)) {
          const fahrenheit = (entry.t2m * 9) / 5 + 32;
          const gdd = Math.max(fahrenheit - 50, 0);
          cumulative += gdd;

          filteredLabels.push(dateLabel);
          gddPoints.push(gdd.toFixed(2));
          cumulativePoints.push(cumulative.toFixed(2));
        }
      });

      setDbChartData({
        labels: filteredLabels,
        datasets: [
          {
            label: "GDD (Daily)",
            data: gddPoints,
            borderColor: COLORS["t2m"],
            backgroundColor: "transparent",
            borderWidth: 2,
            fill: false,
            tension: 0,
            yAxisID: "y",
          },
          {
            label: "Cumulative GDD",
            data: cumulativePoints,
            borderColor: "#800080", // purple
            backgroundColor: "transparent",
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            yAxisID: "y1",
          },
        ],
      });

      const reversedTableData = filteredLabels
        .map((date, index) => ({
          date,
          gdd: gddPoints[index],
          cumulativeGdd: cumulativePoints[index],
        }))
        .reverse(); // 🔁 Reverse to show latest date first

      setDbTableData(reversedTableData);
    } else {
      const dbLabels = weatherDataFromDB.map((entry) => formatDate(entry.date));
      const dbDataPoints = weatherDataFromDB.map((entry) => {
        if (selectedParam === "t2m") {
          const fahrenheit = (entry.t2m * 9) / 5 + 32;
          return fahrenheit.toFixed(2);
        }
        return entry[selectedParam] != null
          ? entry[selectedParam].toFixed(2)
          : 0;
      });

      const forecastLabels = Array.isArray(forecastData)
        ? forecastData.map((entry) => formatDate(entry.date))
        : [];

      const forecastKey = forecastKeyMap[selectedParam];
      const forecastPoints = Array.isArray(forecastData)
        ? forecastData.map((entry) =>
            entry[forecastKey] != null ? entry[forecastKey].toFixed(2) : null
          )
        : [];

      const showForecast = selectedParam !== "rfd" && selectedParam !== "et";

      const allLabels = showForecast
        ? [...dbLabels.reverse(), ...forecastLabels]
        : dbLabels.reverse();

      setAllChartLabels(allLabels);
      setForecastStartLabel(
        showForecast && forecastLabels.length > 0 ? forecastLabels[0] : null
      );

      const mainDataset = {
        label: `DB: ${PARAMETERS[selectedParam]}`,
        data: dbDataPoints.reverse(),
        borderColor: COLORS[selectedParam],
        backgroundColor: selectedParam === "rain" ? COLORS.rain : "transparent",
        borderWidth: 2,
        fill: selectedParam !== "rain",
        tension: 0,
      };

      const datasets = [mainDataset];

      if (showForecast) {
        const forecastDataset = {
          label: `Forecast: ${PARAMETERS[selectedParam]}`,
          data: [...new Array(dbLabels.length).fill(null), ...forecastPoints],
          borderColor: COLORS[selectedParam],
          backgroundColor:
            selectedParam === "rain" ? COLORS.rain : "transparent",
          borderDash: [10, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.2,
        };
        datasets.push(forecastDataset);
      }

      setDbChartData({
        labels: allLabels,
        datasets,
      });

      let tableRows = dbLabels.map((date, index) => {
        const value =
          selectedParam === "t2m"
            ? ((weatherDataFromDB[index]?.t2m * 9) / 5 + 32).toFixed(2)
            : dbDataPoints[index];
        return { date, value };
      });

      tableRows = tableRows.reverse(); // show latest date first

      setDbTableData(tableRows);
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

  console.log("Selected param:", selectedParam);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    layout: { padding: { right: 20, top: 30 } },
    plugins: {
      legend: {
        display: selectedParam === "gdd",
        position: "right",
        labels: {
          font: { size: 16 },
          color: "#333",
          boxWidth: 20,
        },
      },
      ...(forecastStartLabel &&
        allChartLabels.length > 0 && {
          annotation: {
            annotations: {
              forecastDivider: {
                type: "line",
                scaleID: "x",
                value: forecastStartLabel,
                borderColor: "gray",
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: "Forecast Start",
                  enabled: true,
                  position: "start",
                  font: {
                    style: "italic",
                    size: 14,
                  },
                  color: "#555",
                  yAdjust: -10,
                },
              },
              forecastRegion: {
                type: "box",
                xMin: forecastStartLabel,
                xMax: allChartLabels[allChartLabels.length - 1],
                backgroundColor: "rgba(173, 216, 230, 0.15)",
                borderWidth: 0,
              },
            },
          },
        }),
    },
    scales: {
      x: {
        reverse: false,
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
        position: "left",
        title: {
          display: true,
          text:
            selectedParam === "gdd"
              ? "GDD (°F)"
              : PARAMETERS[selectedParam] || "Value",
          font: { size: 30 },
        },
        ticks: { font: { size: 20 } },
      },
      y1: {
        position: "right",
        display: selectedParam === "gdd",
        grid: { drawOnChartArea: false },
        title: {
          display: selectedParam === "gdd",
          text: "Cumulative GDD (°F)",
          font: { size: 30 },
        },
        ticks: { font: { size: 20 } },
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
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Date
                </th>
                {selectedParam === "gdd" ? (
                  <>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      GDD (°F)
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      Cumulative GDD (°F)
                    </th>
                  </>
                ) : (
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {PARAMETERS[selectedParam]}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {dbTableData.map((entry, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {entry.date}
                  </td>
                  {selectedParam === "gdd" ? (
                    <>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {entry.gdd}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        {entry.cumulativeGdd}
                      </td>
                    </>
                  ) : (
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      {entry.value}
                    </td>
                  )}
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

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement,
// } from "chart.js";

// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   LineElement,
//   PointElement
// );

// const token = localStorage.getItem("token");

// const PARAMETERS = {
//   rain: "Rainfall (in)",
//   rfd: "Radiation Flux Density (W/m²)",
//   rh: "Humidity (%)",
//   ws: "Wind Speed (mph)",
//   et: "Evapotranspiration (in)",
//   t2m: "Growing Degree Days (°F)"
// };

// const COLORS = {
//   rain: "#99ccff",
//   rfd: "#FF8C00",
//   rh: "#FF1493",
//   ws: "#FF4500",
//   et: "#32CD32",
//   t2m: "#228B22",
// };

// const WeatherGraph = () => {
//   const [weatherData, setWeatherData] = useState([]);
//   const [selectedParam, setSelectedParam] = useState("rain");
//   const [chartData, setChartData] = useState(null);
//   const [yAxisData, setYAxisData] = useState(null);
//   const [weatherDataFromDB, setWeatherDataFromDB] = useState([]);
//   const [dbChartData, setDbChartData] = useState(null);
//   const [dbTableData, setDbTableData] = useState([]);

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const response = await axios.get(`/api/weather`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setWeatherData(response.data);
//       } catch (error) {
//         console.error("Error fetching weather data", error);
//       }
//     };

//     const fetchWeatherDataFromDB = async () => {
//       try {
//         const response = await axios.get(`/api/weatherfromdb`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setWeatherDataFromDB(response.data);
//       } catch (error) {
//         console.error("Error fetching weather data from DB", error);
//       }
//     };

//     fetchWeatherData();
//     fetchWeatherDataFromDB();
//   }, []);

//   useEffect(() => {
//     if (weatherData.length === 0) return;

//     const formatDate = (dateString) => {
//       const date = new Date(dateString);
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate() + 1).padStart(2, "0");
//       return `${month}/${day}`;
//     };

//     const labels = weatherData.map((entry) => formatDate(entry.date));
//     const dataPoints = weatherData.map((entry) =>
//       entry[selectedParam] != null ? entry[selectedParam].toFixed(2) : 0
//     );

//     if (weatherDataFromDB.length > 0) {
//       const dbLabels = weatherDataFromDB.map((entry) => formatDate(entry.date));
//       const dbDataPoints = weatherDataFromDB.map((entry) => {
//         if (selectedParam === "t2m") {
//           const fahrenheit = (entry.t2m * 9) / 5 + 32;
//           const gdd = Math.max(fahrenheit - 50, 0);
//           return gdd.toFixed(2);
//         }
//         return entry[selectedParam] != null ? entry[selectedParam].toFixed(2) : 0;
//       });
//       setYAxisData({
//         labels: dbLabels,
//         datasets: [
//           {
//             label: `Y-Axis Scale`,
//             data: dbDataPoints,
//           },
//         ],
//       });

//       setDbChartData({
//         labels: dbLabels,
//         datasets: [
//           {
//             label: `DB: ${PARAMETERS[selectedParam]}`,
//             data: dbDataPoints,
//             backgroundColor: selectedParam === "rain" ? "#99ccff" : "transparent",
//             borderColor: COLORS[selectedParam] || "#99ccff",
//             borderWidth: 2,
//             fill: selectedParam !== "rain",
//             tension: 0,
//           },
//         ],
//       });

//       setDbTableData(
//         dbLabels.map((date, index) => ({ date, value: dbDataPoints[index] }))
//       );
//     }
//   }, [selectedParam, weatherData, weatherDataFromDB]);

//   const chartScrollRef = useRef(null);

//   useEffect(() => {
//     if (chartScrollRef.current) {
//       chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
//     }
//   }, [dbChartData]);

//   const baseChartOptions = {
//     maintainAspectRatio: false,
//     responsive: true,
//     layout: { padding: { right: 20 } },
//     scales: {
//       x: {
//         reverse: true,
//         ticks: {
//           font: { size: 20 },
//           autoSkip: false,
//           maxRotation: 0,
//           padding: 10,
//           maxTicksLimit: 7,
//         },
//         title: { display: true, text: "Date", font: { size: 30 } },
//       },
//       y: {
//         ticks: { font: { size: 20 } },
//       },
//     },
//   };

//   const yAxisOnlyOptions = {
//     maintainAspectRatio: false,
//     responsive: true,
//     plugins: { legend: { display: false } },
//     scales: {
//       x: { display: false },
//       y: {scales:
//         baseChartOptions.scales.y,
//         title: {
//           display: true,
//           text: PARAMETERS[selectedParam],
//           font: { size: 30 },
//         },},
//     },
//   };

//   const dataChartOptions = {
//     ...baseChartOptions,
//     scales: {
//       ...baseChartOptions.scales,
//       y: { display: false },
//     },
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px", marginTop: "20px" }}>
//         {Object.keys(PARAMETERS).map((param) => (
//           <div
//             key={param}
//             onClick={() => setSelectedParam(param)}
//             style={{
//               cursor: "pointer",
//               padding: "10px 16px",
//               backgroundColor: selectedParam === param ? "#fa4616" : "#F5F5F5",
//               border: selectedParam === param ? "2px solid rgb(255, 255, 255)" : "2px solid rgb(37, 106, 185)",
//               borderRadius: "12px",
//               color: selectedParam === param ? "white" : "#333",
//               boxShadow: selectedParam === param ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
//               transition: "all 0.3s ease-in-out",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               textAlign: "center",
//               height: "50px",
//             }}
//           >
//             <span>{PARAMETERS[param]}</span>
//           </div>
//         ))}
//       </div>

//       <div style={{ display: "flex", alignItems: "start", gap: "20px", width: "100%", maxHeight: "500px" }}>
//         {/* Fixed Y-Axis Chart */}
//         <div style={{ width: "80px", height: "500px" }}>
//           {dbChartData && <Line data={yAxisData} options={yAxisOnlyOptions} />}
//         </div>

//         {/* Main Chart */}
//         {dbChartData && (
//           <div ref={chartScrollRef} style={{ flexGrow: 1, minWidth: "800px", height: "500px", overflowX: "auto" }}>
//             <div style={{ width: `${dbChartData.labels.length * 100}px`, height: "100%" }}>
//               {selectedParam === "rain" ? (
//                 <Bar data={dbChartData} options={dataChartOptions} />
//               ) : (
//                 <Line data={dbChartData} options={dataChartOptions} />
//               )}
//             </div>
//           </div>
//         )}

//         {/* DB Data Table Container */}
//         <div style={{ width: "500px", height: "500px", overflowY: "auto", backgroundColor: "#f4f4f4", borderRadius: "10px", padding: "20px" }}>
//           <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#002657" }}>{PARAMETERS[selectedParam]}</h3>
//           <table style={{ borderCollapse: "collapse", width: "100%", borderRadius: "10px" }}>
//             <thead>
//               <tr style={{ backgroundColor: "#002657", color: "white" }}>
//                 <th style={{ padding: "10px" }}>Date</th>
//                 <th style={{ padding: "10px" }}>{PARAMETERS[selectedParam]}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {dbTableData.map((entry, index) => (
//                 <tr key={index}>
//                   <td style={{ border: "1px solid", padding: "10px", textAlign: "center" }}>{entry.date}</td>
//                   <td style={{ border: "1px solid", padding: "10px", textAlign: "center" }}>{entry.value}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WeatherGraph;
