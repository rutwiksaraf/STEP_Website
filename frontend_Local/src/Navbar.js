import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Link,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navbarStyle = {
    backgroundColor: "#0021A5",
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        <ListItem button component={RouterLink} to="http://step.ifas.ufl.edu">
          <ListItemText primary="HOME" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="https://step.ifas.ufl.edu/news-and-events/"
        >
          <ListItemText primary="NEWS AND EVENTS" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="https://step.ifas.ufl.edu/teams/"
        >
          <ListItemText primary="TEAMS" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="https://step.ifas.ufl.edu/project-management/"
        >
          <ListItemText primary="PROJECT MANAGEMENT" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="https://step.ifas.ufl.edu/sponsors/"
        >
          <ListItemText primary="SPONSORS" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="https://step.ifas.ufl.edu/mobile-menu/education-and-training/"
        >
          <ListItemText primary="EDUCATION AND TRAINING" />
        </ListItem>
        <ListItem button component={RouterLink} to="/login">
          <ListItemText primary="LOGIN" />
        </ListItem>
        {/* Add other navigation links here */}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" style={navbarStyle}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Container
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                color="inherit"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src="https://step.ifas.ufl.edu/media/ifasufledu/white/style-assets/css/images/IFASwhitelogo.svg"
                  alt="US Step"
                  width="130px"
                  height="43px"
                />
              </Link>
              <Button
                color="inherit"
                component={RouterLink}
                to="http://step.ifas.ufl.edu"
              >
                HOME
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="https://step.ifas.ufl.edu/team-registration/"
              >
                TEAM REGISTRATION
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="https://step.ifas.ufl.edu/teams/"
              >
                TEAMS
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="https://step.ifas.ufl.edu/project-management/"
              >
                PROJECT MANAGEMENT
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="https://step.ifas.ufl.edu/sponsors/"
              >
                SPONSORS
              </Button>

              <Button
                color="inherit"
                component={RouterLink}
                to="https://step.ifas.ufl.edu/mobile-menu/education-and-training/"
              >
                EDUCATION AND TRAINING
              </Button>
            </Container>
          )}
        </Toolbar>
      </AppBar>
      {/* Sub-navbar remains unchanged */}
      {/* <div
        style={{
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          padding: "20px",
          paddingBottom: "50px",
        }}
      >
        <img
          src="https://step.ifas.ufl.edu/media/stepifasufledu/images/uftaps-150x57.png"
          alt="FLORIDA STAKEHOLDER ENGAGEMENT PROGRAM (STEP)"
          width="140"
          height="65"
          style={{ marginLeft: "60px", marginRight: "60px" }}
        />
        <Typography variant="h4" component="div" color={"#0021A5"}>
          FLORIDA STAKEHOLDER ENGAGEMENT PROGRAM (STEP)
        </Typography>
      </div> */}
      <div>
        <Box
          sx={{
            backgroundColor: "#f0f0f0",
            padding: "20px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center the items horizontally
            flexDirection: { xs: "row", sm: "row" }, // Stack on small devices, row on others
          }}
        >
          <Box
            sx={{
              marginLeft: { sm: "60px", xs: "0" },
              marginRight: { sm: "60px", xs: "0" },
              // marginBottom: { xs: "100px", sm: "0px" }, // Add margin bottom on small devices
              textAlign: { xs: "center", sm: "left" }, // Center text on small devices
            }}
          >
            <img
              src="/UF_TAPS_Logo.png"
              alt="Florida Stakeholder Engagement Program (STEP)"
              width="200"
              height="100"
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: "#0021A5",
              fontFamily: "'gentona_medium', Arial, sans-serif", // Change font to a more modern and elegant one
              fontWeight: 600, // Make it bold for emphasis
              letterSpacing: "1px", // Add slight spacing for better readability
              fontSize: {
                xs: "1.5rem", // Smaller devices
                sm: "2rem", // Slightly larger screens
                md: "2.125rem", // Default size for 'h4' variant, adjust as needed
              },
            }}
          >
            Florida Stakeholder Engagement Program (STEP)
          </Typography>
        </Box>
      </div>
    </>
  );
}

export default Navbar;
