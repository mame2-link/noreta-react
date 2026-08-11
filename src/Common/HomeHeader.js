import React, { useState } from "react";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import { SearchDrawer } from "./SearchDrawer";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export function HomeHeader({ title }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <>
      <ElevationScroll>
        <AppBar>
          <Toolbar
            sx={{
              display: "flex",
              direction: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              color="inherit"
              href="/"
              aria-label="ホームに移動"
            >
              <HomeIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              sx={{ flexGrow: 1 }}
              align="center"
            >
              {title}
            </Typography>
            <IconButton
              size="large"
              color="inherit"
              onClick={toggleDrawer(true)}
              aria-label="バス停名で検索"
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <SearchDrawer isOpen={isOpen} toggleDrawer={toggleDrawer} />
    </>
  );
}
