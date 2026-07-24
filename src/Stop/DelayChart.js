import { ScatterChart } from "@mui/x-charts/ScatterChart";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { initBaseTimestamp, spentSec } from "../Common/CommonFunc";

export function DelayChart(props) {
  const stopTimes = props.stopTimes;
  const timestamp0 = initBaseTimestamp();
  const data = [];
  let delayMax = 15;
  for (const stopTime of stopTimes) {
    const timestamp = timestamp0 + spentSec(stopTime.departure_time);
    const ts = timestamp * 1000;
    let delay = null;
    if (stopTime.timestamp) {
      delay = (stopTime.timestamp - timestamp) / 60; // 分
      if (delay < 0) delay = 0;
      if (delay > delayMax) delayMax = delay;
      data.push({ x: ts, y: delay, id: stopTime.trip_id });
    }
  }
  const w = window.innerWidth - 16;
  const HMAX = 600;
  const h = w < HMAX ? w : HMAX;
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box sx={{ m: 1 }}>
        <ScatterChart
          width={w}
          height={h}
          yAxis={[{ label: "分", min: 0, max: delayMax }]}
          series={[
            {
              label: "遅れ",
              data: data,
              id: "tripId",
            },
          ]}
          xAxis={[{ scaleType: "time" }]}
        />
      </Box>
    </Stack>
  );
}
