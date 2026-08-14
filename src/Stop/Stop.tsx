import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import { getStop } from '../lib/data';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { StopName } from "./StopName";
// import { BusStopSchema } from "./BusStopSchema";
import { StopTimes } from "./StopTimes";
import { HideHomeHeader } from "../Common/HideHomeHeader";
import { CommonFooter } from "../Common/CommonFooter";
// import { addStopId } from "../Common/IndexedDb";


export default function Stop() {
  const { stopId } = useParams();
  const [stop, setStop] = useState<Schema["Stop"]["type"]>();
  const [errorStatus, setErrorStatus] = useState(false);

  // location query
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  const page = pageStr === null ? null : parseInt(pageStr);

  useEffect(() => {
    const fetchData = async () => {
      const value = await getStop(stopId!);
      if (!value.data) {
        setErrorStatus(true);
        return;
      }
      setStop(value.data);
    };
    fetchData();
    // indexedDB
    // addStopId(stopId!).catch((e) => console.error(e));
  }, []);

  return (
    <>
      {stop && <HideHomeHeader stop={stop} />}
      <main>
        {errorStatus && (
          <Typography sx={{ m: 2 }}>バス停が見つかりません😔</Typography>
        )}
        {stop && <StopName stop={stop} />}
        {stop && <StopTimes stop={stop} page={page} />}
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
      {/* {stop && <BusStopSchema stop={stop} />} */}
    </>
  );
}
