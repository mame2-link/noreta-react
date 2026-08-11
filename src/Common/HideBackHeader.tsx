import { useState } from "react";
import PropTypes from "prop-types";

import { /*useNavigate,*/ useLocation } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import AppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

import { Logo1Icon } from "./Logo1Icon";
import { BusStopIcon } from "./BusStopIcon";
import { LineIcon } from "./CommonFunc";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export function HideBackHeader({ stop }: { stop: Schema["Stop"]["type"] }) {
  // const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);


  let stopName = stop.stop_name;
  if (stop.platform_code) stopName += " " + stop.platform_code;

  const stopUrl = "/stop/" + stop.stop_id;
  const searchUrl = "/search";
  const lineTargetUrl =
    "https://t2.mame2.link" + location.pathname + location.search;
  const sendByLineUrl =
    "https://line.me/R/msg/text/?" + encodeURIComponent(lineTargetUrl);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const localtheme = createTheme({
    palette: {
      primary: { main: "#f5f5f5" },
    },
  });

  return (
    <ThemeProvider theme={localtheme}>
      <HideOnScroll>
        <AppBar elevation={0}>
          <Toolbar>
            <IconButton
              size="large"
              color="inherit"
              edge="start"
              aria-label="ひとつ前に戻る"
              href={stopUrl}
            // onClick={() => navigate(stopUrl)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="large"
              color="inherit"
              edge="end"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar></Toolbar>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem key="home" disablePadding>
              <ListItemButton href="/">
                <ListItemIcon>
                  <Logo1Icon />
                </ListItemIcon>
                <ListItemText primary="バス運行情報" />
              </ListItemButton>
            </ListItem>
            <ListItem key="stop" disablePadding>
              <ListItemButton href={stopUrl}>
                <ListItemIcon>
                  <BusStopIcon />
                </ListItemIcon>
                <ListItemText primary={stopName} />
              </ListItemButton>
            </ListItem>
            <ListItem key="search" disablePadding>
              <ListItemButton href={searchUrl}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="バス停検索" />
              </ListItemButton>
            </ListItem>
            <ListItem key="sendByLine" disablePadding>
              <ListItemButton href={sendByLineUrl}>
                <ListItemIcon>
                  <LineIcon />
                </ListItemIcon>
                <ListItemText primary="Lineで送る" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}
