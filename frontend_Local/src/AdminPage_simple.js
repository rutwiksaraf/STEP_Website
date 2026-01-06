// AdminPage.js - Super Admin Component
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { TabPanel, a11yProps } from "./TabPanel";
import axios from "axios";
import AdminRegistrationForm from "./AdminRegistrationForm";
import AdminList from "./AdminList";
import CottonAdminPage from "./CottonAdminPage";
import CornAdminPage from "./CornAdminPage";
import { useNavigate } from "react-router-dom";
import ContractPrices from "./ContractPrices";

function AdminPage() {
  const [showMarketingPrices, setShowMarketingPrices] = useState(false);
  const [value, setValue] = useState(0); // Tab index for Corn/Cotton
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [showFileManagement, setShowFileManagement] = useState(false);

  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  const handleCloseAdminPage = () => {
    setShowAdminPage(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleMarketingPricesClick = () => {
    setShowMarketingPrices(true);
  };

  const handleAdminRegistration = () => {
    setShowAdminPage(!showAdminPage);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseContractPrices = () => {
    setShowMarketingPrices(false);
  };

  const handleManageFiles = () => {
    setShowFileManagement(true);
  };

  const handleCloseFileManagement = () => {
    setShowFileManagement(false);
  };

  // Show Admin Registration/List page
  if (showAdminPage) {
    return (
      <div>
        <AdminRegistrationForm onClose={handleCloseAdminPage} />
        <AdminList />
      </div>
    );
  }

  // Show Marketing Prices page
  if (showMarketingPrices) {
    return (
      <div style={{ marginLeft: "20px" }}>
        <Button onClick={handleCloseContractPrices}>Back to Main Page</Button>
        <ContractPrices />
      </div>
    );
  }

  // Main Super Admin Dashboard
  return (
    <div>
      <AppBar position="static" color="default">
        <Paper elevation={3}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Admin Tabs"
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="primary"
          >
            <Tab label="Corn" {...a11yProps(0)} />
            <Tab label="Cotton" {...a11yProps(1)} />
          </Tabs>
        </Paper>
      </AppBar>

      <Paper
        elevation={2}
        style={{
          padding: 20,
          margin: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome Super Admin!
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdminRegistration}
            style={{ marginRight: 10 }}
          >
            Manage Admins
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
            onClick={handleMarketingPricesClick}
          >
            Marketing Prices
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Paper>

      <TabPanel value={value} index={0}>
        <CornAdminPage showSuperAdminFeatures={true} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CottonAdminPage showSuperAdminFeatures={true} />
      </TabPanel>
    </div>
  );
}

export default AdminPage;
