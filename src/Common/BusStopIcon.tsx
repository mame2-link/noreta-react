import SvgIcon from "@mui/material/SvgIcon";

export function BusStopIcon() {
  const fontSize = "medium";
  return (
    <SvgIcon fontSize={fontSize}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="8" r="6.5" stroke="#673AB7" strokeWidth="3" />
        <line
          x1="7"
          y1="8.5"
          x2="18"
          y2="8.5"
          stroke="#673AB7"
          strokeWidth="3"
        />
        <line
          x1="7"
          y1="22.5"
          x2="17"
          y2="22.5"
          stroke="#673AB7"
          strokeWidth="3"
        />
        <line
          x1="12"
          y1="15"
          x2="12"
          y2="23"
          stroke="#673AB7"
          strokeWidth="4"
        />
      </svg>
    </SvgIcon>
  );
}
