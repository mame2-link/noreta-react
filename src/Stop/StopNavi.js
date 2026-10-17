import { useLocation } from "react-router-dom";

import { Stack } from "@mui/material";
import Button from "@mui/material/Button";

import MapIcon from "@mui/icons-material/Map";
// import SearchIcon from "@mui/icons-material/Search";
import NearMeIcon from "@mui/icons-material/NearMe";

import { LineIcon } from "../Common/CommonFunc";

export function StopNavi(props) {
  const stop = props.stop;
  const location = useLocation();
  const lineTargetUrl =
    "https://noreta.net" + location.pathname + location.search;
  const sendByLineUrl =
    "https://line.me/R/msg/text/?" + encodeURIComponent(lineTargetUrl);
  const latlng = stop.stop_lat + "," + stop.stop_lon;
  let appleDevice = false;
  const ua = window.navigator.userAgent.toLowerCase();
  if (
    ua.indexOf("iphone") !== -1 ||
    ua.indexOf("ipad") !== -1 ||
    ua.indexOf("mac os x") !== -1
  ) {
    appleDevice = true;
  }
  let map_url = "https://www.google.com/maps/search/?api=1&query=";
  if (appleDevice) {
    map_url = "https://maps.apple.com/?daddr=";
  }
  let device_map_url = map_url + latlng;
  // const search_url = "/search?stops-index%5Bquery%5D=%20" + stop.stop_name;
  if (appleDevice) {
    device_map_url += "&dirflg=w&t=h"; // transport type: by foot, hybrid view
  } else {
    device_map_url += "&layer=traffic"
  }

  const placeUrl = "/place/" + stop.stop_id;
  // const targetUrl = "https://noreta.net/stop/" + stop.stop_id;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Button aria-label="地図" href={device_map_url} startIcon={<MapIcon />}>
        地図
      </Button>
      <Button aria-label="情報" href={placeUrl} startIcon={<NearMeIcon />}>
        周辺情報
      </Button>
      <Button
        aria-label="Lineで送る"
        href={sendByLineUrl}
        startIcon={<LineIcon />}
      >
        Lineで送る
      </Button>
    </Stack>
  );
}
