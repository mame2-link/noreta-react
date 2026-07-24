import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { generateClient } from "aws-amplify/api";
import { queryStopTimesByStopIdIndex } from "../../graphql/queries";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { BeforeAndAfter } from "./BeforeAndAfter";
import { AutoUpdate } from "./AutoUpdate";
import { FilteredStopTimes } from "./FilteredStopTimes";
import { Intervals } from "./Intervals";
import { getStopTimesAnchorIndex } from "../Common/CommonFunc";
// import { HourlyAverage } from "./HourlyAverage";

export function StopTimes(props) {

  const [stopTimes, setStopTimes] = useState();
  const client = generateClient();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page");
  const page = pageStr === null ? null : parseInt(pageStr);

  const fetchData = async () => {
    console.log("--- StopTimes fetchData ---");
    const stopId = props.stop.stop_id;
    // stop_times
    const tmpArr = [];
    const sts = await client.graphql({
      query: queryStopTimesByStopIdIndex,
      variables: { stop_id: stopId },
    });
    const { items: datas, nextToken } = sts.data.queryStopTimesByStopIdIndex;
    tmpArr.push(...datas);
    let next = nextToken;
    while (next) {
      let stsNxt = await client.graphql({
        query: queryStopTimesByStopIdIndex,
        variables: { stop_id: stopId, after: next },
      });
      const { items: datas2, nextToken } =
        stsNxt.data.queryStopTimesByStopIdIndex;
      tmpArr.push(...datas2);
      next = nextToken;
    }
    tmpArr.sort(function (a, b) {
      if (a.departure_time > b.departure_time) {
        return 1;
      } else {
        return -1;
      }
    });
    const stsArr = tmpArr.filter((elem) => elem.pickup_type !== 1);
    setStopTimes(stsArr);
  }

  let idx = null;

  if (stopTimes) {
    idx = typeof page === "number" ? page : getStopTimesAnchorIndex(stopTimes);
  }

  useEffect(() => {
    fetchData();
    // if (page === null) {
    //   console.log("polling!");
    //   const intervalId = setInterval(fetchData, 30000);
    //   return () => { console.log("clear Interval"); clearInterval(intervalId) };
    // }
  }, []);

  const handleFetchData = () => {
    fetchData();
  };

  return (
    <>
      {!stopTimes && <CircularProgress sx={{ m: 1 }} />}
      {stopTimes?.length === 0 && (
        <Typography sx={{ m: 2 }}>本日は運行便がありません😪</Typography>
      )}
      {stopTimes && stopTimes.length !== 0 && (
        <>
          <BeforeAndAfter idx={idx} len={stopTimes.length} num={5} handleFetchData={handleFetchData} />
          <FilteredStopTimes stopTimes={stopTimes} page={page} idx={idx} />
          {page === null && <AutoUpdate handleFetchData={handleFetchData}></AutoUpdate>}
          <Intervals stopTimes={stopTimes} />
          {/* <HourlyAverage stopTimes={stopTimes} /> */}
        </>
      )}
    </>
  );
}
