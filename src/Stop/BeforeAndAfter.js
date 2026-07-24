import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import UpdateIcon from "@mui/icons-material/Update";
import Stack from "@mui/material/Stack";
import { scrollToTop } from "../Common/CommonFunc";

export function BeforeAndAfter(props) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!Number.isInteger(props.idx)) return;
  const idx = props.idx;
  const len = props.len;
  const NUM = props.num;
  const handleFetchData = props.handleFetchData;

  // prev
  const prev = idx - NUM < 0 ? 0 : idx - NUM;
  const prevDisabled = idx === 0 ? true : false;
  const prevCount = idx > NUM ? NUM : idx;

  // next
  let nextCount = idx + NUM + NUM < len ? NUM : len - idx - NUM;
  let nextDisabled = false;
  if (nextCount < 0) nextCount = 0;
  if (nextCount < 1) nextDisabled = true;

  const prevNavigate = () => {
    navigate(`${location.pathname}?page=${prev}`);
    scrollToTop();
  }

  const realtimeNavigate = () => {
    navigate(location.pathname);
    handleFetchData();
    scrollToTop();
  }

  const nextNavigate = () => {
    navigate(`${location.pathname}?page=${idx + NUM}`);
    scrollToTop();
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
        my: 1,
      }}
    >
      <Button
        onClick={prevNavigate}
        // href={location.pathname + "?page=" + prev}
        disabled={prevDisabled}
      // startIcon={<ArrowBackIcon />}
      >
        前の{prevCount}便
      </Button>
      <Button
        variant="contained"
        // href={location.pathname}
        startIcon={<UpdateIcon />}
        onClick={realtimeNavigate}
      >
        リアルタイム
      </Button>
      <Button
        // variant="outlined"
        // href={location.pathname + "?page=" + (idx + NUM)}
        disabled={nextDisabled}
        onClick={nextNavigate}
      // endIcon={<ArrowForwardIcon />}
      >
        次の{nextCount}便
      </Button>
    </Stack >
  );
}
