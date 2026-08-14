import { useLocation, useNavigate } from "react-router";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import { StopTime } from "../lib/stop_time";
import { hhmm, diffSec, getStopTimesAnchorIndex, scrollToTop } from "../Common/CommonFunc";

export function Intervals({ stopTimes }: { stopTimes: StopTime[] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const pageStr = queryParams.get("page")
    ? queryParams.get("page")
    : getStopTimesAnchorIndex(stopTimes).toString();
  // console.log(getStopTimesAnchorIndex(stopTimes).toString());
  // const page = pageStr === null ? null : parseInt(pageStr);
  // const navigate = useNavigate();
  const lastIndex = stopTimes.length - 1;
  if (lastIndex < 1) return;
  const s = diffSec(
    stopTimes[lastIndex].departure_time!,
    stopTimes[0].departure_time!
  );
  // const h = Math.floor(s / 3600);
  // const r = s % 3600;
  // const m = Math.floor(r / 60);
  // console.log(h, m); // 営業時間
  const i = Math.round(s / lastIndex);
  const im = Math.floor(i / 60);
  const is = i % 60;
  const f_url = `${location.pathname}?page=0`;
  const l_url = `${location.pathname}?page=${lastIndex}`;

  const stopTimeList = [];
  for (const idx in stopTimes) {
    // const href = `${location.pathname}?page=${idx}`;
    stopTimeList.push(
      <MenuItem key={idx} value={idx}>
        {hhmm(stopTimes[idx].departure_time!)}
      </MenuItem>
    );
  }
  stopTimeList.push(
    <MenuItem key={stopTimes.length} value={stopTimes.length}></MenuItem>
  );

  // console.log(getDate().getDate());

  // const handleChange = (event) => {
  //   console.log(location.pathname);
  //   navigate({
  //     pathname: location.pathname,
  //     search: createSearchParams({ page: event.target.value }).toString(),
  //   });
  // };

  const handleFirst = () => {
    navigate(f_url);
    scrollToTop();
  }

  const handleLast = () => {
    navigate(l_url);
    scrollToTop();
  }

  const handleOnChange = (e: SelectChangeEvent<string | number>) => {
    const page = String(e.target.value ?? "0");
    const s_url = `${location.pathname}?page=${page}`;
    navigate(s_url);
    scrollToTop();
  }

  return (
    <Box sx={{ m: 2 }}>
      <Box sx={{ minWidth: 120, my: 1 }}>
        <FormControl fullWidth>
          <InputLabel id="departure_time_label">発車時刻</InputLabel>
          <Select
            value={pageStr!}
            labelId="departure_time_label"
            label="発車時刻"
            autoWidth
            onChange={handleOnChange}
          >
            {stopTimeList}
          </Select>
        </FormControl>
      </Box>
      <TableContainer sx={{ my: 1 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                始発
              </TableCell>
              <TableCell>
                <Link component="button" onClick={handleFirst}>{hhmm(stopTimes[0].departure_time!)}</Link>
              </TableCell>
              <TableCell component="th" scope="row">
                最終
              </TableCell>
              <TableCell>
                <Link component="button" onClick={handleLast}>{hhmm(stopTimes[lastIndex].departure_time!)}</Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                運行本数
              </TableCell>
              <TableCell>{stopTimes.length}本</TableCell>
              <TableCell component="th" scope="row">
                平均運行間隔
              </TableCell>
              <TableCell>
                {im}分{is}秒
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
