import React, { useEffect } from "react";
import { useHits } from "react-instantsearch";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { HeadsignList } from "./HeadsignList";

function Hit({ hit }) {
  const stopUrl = "/stop/" + hit.objectID;
  let stopName = hit.stopName;
  if (hit.platform_code && hit.platform_code.length > 0) {
    stopName += " のりば " + hit.platform_code;
  }
  return (
    // <Paper
    //   sx={{ p: 2, mt: 2, bgcolor: "grey.300" }}
    //   itemScope
    //   itemType="https://schema.org/BusStop"
    // >
    <MenuItem itemScope itemType="https://schema.org/BusStop">
      <Link href={stopUrl}>{stopName}</Link>
      <meta itemProp="name" content={hit.stopName} />
      <meta itemProp="latitude" content={hit._geoloc.lat} />
      <meta itemProp="longitude" content={hit._geoloc.lng} />
    </MenuItem>
    // </Paper>
  );
}

export function CustomSimpleHits(props) {
  const { items, sendEvent } = useHits(props);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    console.log(event);
    setAnchorEl(event.currentTarget);
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      {items.map((hit) => (
        <Hit hit={hit} key={hit.objectID} />
      ))}
    </Menu>
  );
}
