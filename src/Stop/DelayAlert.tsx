import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { DIFF_SEC_MAX } from "../Common/CommonFunc";

export function DelayAlert(props) {
  const delays = props.delays;
  if (!delays) return;
  if (!Array.isArray(delays)) return;
  if (delays.length === 0) return;
  const delayMax = delays.reduce((a, b) => Math.max(a, b), -Infinity);
  if (delayMax === 0) return; // No Alert
  const delayMin = delays.reduce((a, b) => Math.min(a, b), Infinity);
  // severity
  let severity = "info";
  if (delayMax > 4) severity = "warning";
  if (delayMax > 9) severity = "error";

  if (delayMin === delayMax) {
    return (
      <Stack sx={{ m: 2 }}>
        <Alert severity={severity}>直近{DIFF_SEC_MAX / 60}分で約{delayMax}分の遅れがあります</Alert>
      </Stack>
    );
  }
  return (
    <Stack sx={{ m: 2 }}>
      <Alert severity={severity}>
        直近{DIFF_SEC_MAX / 60}分で約{delayMin}～{delayMax}分の遅れがあります
      </Alert>
    </Stack>
  );
}
