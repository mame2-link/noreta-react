import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import type { Schema } from "../../amplify/data/resource";

import { queryStopTimesByStopIdIndex } from "../lib/data";
import { StopTime } from "../lib/stop_time";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { BeforeAndAfter } from "./BeforeAndAfter";
// import { AutoUpdate } from "./AutoUpdate";
import { FilteredStopTimes } from "./FilteredStopTimes";
import { Intervals } from "./Intervals";
import { getStopTimesAnchorIndex } from "../Common/CommonFunc";

export function StopTimes({ stop, page }: { stop: Schema["Stop"]["type"], page: number | null }) {

  const [stopTimes, setStopTimes] = useState<StopTime[]>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  page = pageStr === null ? null : parseInt(pageStr);

  let idx = null;
  if (stopTimes) {
    idx = typeof page === "number" ? page : getStopTimesAnchorIndex(stopTimes);
  }

  useEffect(() => {
    const fetchData = async () => {
      const stop_times = await queryStopTimesByStopIdIndex(stop.stop_id) as StopTime[];
      setStopTimes(stop_times);
    };
    fetchData();
    // if (page === null) {
    //   console.log("polling!");
    //   const intervalId = setInterval(fetchData, 30000);
    //   return () => { console.log("clear Interval"); clearInterval(intervalId) };
    // }
  }, []);

  const handleFetchData = async () => {
    const stop_times = await queryStopTimesByStopIdIndex(stop.stop_id) as StopTime[];
    setStopTimes(stop_times);;
  };

  return (
    <>
      {!stopTimes && <CircularProgress sx={{ m: 1 }} />}
      {stopTimes?.length === 0 && (
        <Typography sx={{ m: 2 }}>本日は運行便がありません😪</Typography>
      )}

      {stopTimes && stopTimes.length !== 0 && (
        <>
          <BeforeAndAfter idx={idx!} len={stopTimes.length} num={5} handleFetchData={handleFetchData} />
          <FilteredStopTimes stopTimes={stopTimes} page={page} idx={idx!} />
          {/* {page === null && <AutoUpdate handleFetchData={handleFetchData}></AutoUpdate>} */}
          <Intervals stopTimes={stopTimes} />
        </>
      )}

    </>
  );
}
