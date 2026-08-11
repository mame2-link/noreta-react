import React from "react";

import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";

export function SimpleBackHeader() {
  const navigate = useNavigate();
  return (
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
        <div></div>
      </Toolbar>
    </AppBar>
  );
}
