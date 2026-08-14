import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

import { useLocation } from "react-router";

import { StopTime } from "../lib/stop_time";
import { /*initBaseTimestamp,*/ delayMin } from "../Common/CommonFunc";

export function HourlyAverage({ stopTimes }: { stopTimes: StopTime[] }) {
  const location = useLocation();

  // const timestamp0 = initBaseTimestamp();
  // initBaseTimestamp();

  const hourMap = new Map();
  const hourlyAverage = [];

  let last_hour = 0;
  let arr = null;
  for (const stopTime of stopTimes) {
    const departure_time = stopTime.departure_time;
    const hour = getHour(departure_time!);
    if (last_hour !== hour) {
      last_hour = hour;
      hourMap.set(hour, []);
      arr = hourMap.get(hour);
    }
    arr.push(stopTime);
  }

  let idx = 0;
  for (const [key, value] of hourMap.entries()) {
    let min = null;
    let max = null;
    let delayStr = "データなし";
    for (const stopTime of value) {
      const departure_time = stopTime.departure_time;
      const timestamp = stopTime.timestamp;
      if (timestamp) {
        let delay_min = delayMin(timestamp, departure_time);
        if (delay_min < 0) delay_min = 0;
        if (min === null || delay_min < min) {
          min = delay_min;
        }
        if (max === null || delay_min > max) {
          max = delay_min;
        }
      }
    }
    if (min === null || max === null) {
      delayStr = "データなし";
      // } else if ((min === 0) & (max === 0)) {
      //   delayStr = "遅れなし";
    } else if (min === max) {
      delayStr = min + "分";
    } else {
      delayStr = min + "-" + max + "分";
    }
    // const delayStr = getDelayStr(value);
    const indexUrl = location.pathname + "?page=" + idx;
    hourlyAverage.push(
      <TableRow key={key}>
        <TableCell component="th" scope="row">
          <Link href={indexUrl}>{key}時台</Link>
        </TableCell>
        <TableCell align="right">{value.length}本</TableCell>
        <TableCell align="right">{delayStr}</TableCell>
      </TableRow>
    );
    idx += value.length;
  }

  return (
    <Box sx={{ m: 2 }}>
      <TableContainer sx={{ my: 1, maxWidth: "sm" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>時間帯</TableCell>
              <TableCell align="right">本数</TableCell>
              <TableCell align="right">遅れ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{hourlyAverage}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function getHour(timeStr: string) {
  return parseInt(timeStr.substr(0, timeStr.indexOf(":")));
}

// function getDelayStr(stopTimes) {
//   let min = null;
//   let max = null;
//   for (const stopTime of stopTimes) {
//     const departure_time = stopTime.departure_time;
//     const timestamp = stopTime.timestamp;
//     if (timestamp) {
//       let delay_min = delayMin(timestamp, departure_time);
//       if (delay_min < 0) delay_min = 0;
//       if (min === null || delay_min < min) {
//         min = delay_min;
//       }
//       if (max === null || delay_min > max) {
//         max = delay_min;
//       }
//     }
//   }
//   if (min === null || max === null) {
//     return "データなし";
//   }
//   if ((min === 0) & (max === 0)) {
//     return "遅れなし";
//   }
//   if (min === max) {
//     return min + "分";
//   }
//   return min + "-" + max + "分";
// }
