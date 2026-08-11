import React from "react";
// import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
// import useScrollTrigger from "@mui/material/useScrollTrigger";

// function ElevationScroll(props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 0,
//     target: window ? window() : undefined,
//   });

//   return React.cloneElement(children, {
//     elevation: trigger ? 4 : 0,
//   });
// }

// ElevationScroll.propTypes = {
//   children: PropTypes.element.isRequired,
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window: PropTypes.func,
// };

export function CommonHeader({ title }) {
  const navigate = useNavigate();
  return (
    // <>
    //   <ElevationScroll>
    <AppBar position="relative">
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
          aria-label="ひとつ前に戻る"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          sx={{ flexGrow: 1 }}
          align="center"
        >
          {title}
        </Typography>
        <div></div>
      </Toolbar>
    </AppBar>
    //   </ElevationScroll>
    //   <Toolbar />
    // </>
  );
}
