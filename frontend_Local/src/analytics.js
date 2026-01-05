// src/analytics.js
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-GJBVKDFNNY"); // Replace with your Measurement ID
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
