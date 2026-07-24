import Box from "@mui/material/Box";

import { FilteredCardList } from "./FilteredCardList";
import { FilteredWithDelayedStopTimes } from "./FilteredWithDelayedStopTimes";
import { getTimeString } from "../Common/CommonFunc";

export function FilteredStopTimes(props) {
  const NUM = 5;
  const stopTimes = props.stopTimes;
  const len = stopTimes.length;
  const page = props.page;
  const idx = props.idx;
  const end = idx + NUM > len ? len : idx + NUM;
  const filtered = stopTimes.slice(idx, end);
  const nowStr = getTimeString();

  // 固定ページ（リアルタイム以外）を表示
  if (page !== null) {
    return (
      <Box
        sx={{
          m: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: 2,
        }}
      >
        <FilteredCardList stopTimes={filtered} idx={idx} />
      </Box>
    );
  }

  return <FilteredWithDelayedStopTimes stopTimes={stopTimes} nowStr={nowStr} />;
}
