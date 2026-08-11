import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import { getStop } from '../lib/data';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CommonFooter } from "../Common/CommonFooter";
import { toHalfWidth, setMetaOgTitle } from "../Common/CommonFunc";
import { HideBackHeader } from "../Common/HideBackHeader";
import { NearbyStops } from "./NearbyStops";
import { StopInfo } from "./StopInfo";

export default function Place() {
  const { stopId } = useParams();
  const [stop, setStop] = useState<Schema["Stop"]["type"]>();
  const [errorStatus, setErrorStatus] = useState(false);


  const location = useLocation();

  async function fetchData(stopId) {
    // Stop
    const value = await getStop(stopId);
    if (!value.data) {
      return;
    }
    setStop(value.data);

    // stop name
    const stopName = stop.platform_code
      ? stop.stop_name + " のりば" + stop.platform_code
      : stop.stop_name;

    const rSet = new Set();
    const hSet = new Set();
    for (const headsign of stop.headsigns) {
      const routeShortName = headsign.route_short_name;
      const stopHeadsign = headsign.headsign;
      rSet.add(routeShortName);
      hSet.add(stopHeadsign);
    }
    const shortNameStr = Array.from(rSet)
      .slice(0, 3)
      .toString()
      .replaceAll(",", " ");
    const headsignStr = Array.from(hSet)
      .slice(0, 3)
      .toString()
      .replaceAll(",", " ");

    // title
    const title = toHalfWidth(
      "周辺情報 " + stopName + " " + shortNameStr + " " + headsignStr + "方面"
    );
    document.title = title;

    // og:title
    setMetaOgTitle(title);

    const descShortNameStr = Array.from(rSet).toString().replaceAll(",", " ");
    const descHeadsignStr = Array.from(hSet).toString().replaceAll(",", " ");

    // description
    const description = toHalfWidth(
      "周辺情報です " +
      stopName +
      " " +
      descShortNameStr +
      " " +
      descHeadsignStr +
      "方面"
    );

    // document
    //   .querySelector('meta[name="description"]')
    //   .setAttribute("content", description);

    // aws-amplify/analitycs
    // record({
    //   name: "placeVisit",
    //   attributes: { id: stop.stop_id },
    // });

    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }

  useEffect(() => {
    fetchData(stopId);
  }, []);

  return (
    <>
      {stop && <HideBackHeader stop={stop}></HideBackHeader>}
      <main>
        {errorStatus && (
          <Typography sx={{ m: 2 }}>バス停が見つかりません😔</Typography>
        )}
        {/* {stop && (
          <Box sx={{ p: 1 }}>
            <StopInfo stop={stop} key={stop.stop_id} />
          </Box>
        )} */}
        <Typography component="h2" sx={{ mt: 2, mx: 1 }}>
          近くのバス停
        </Typography>
        {stop && stop.nearby && stop.nearby.length > 0 && (
          <NearbyStops stop={stop} />
        )}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
