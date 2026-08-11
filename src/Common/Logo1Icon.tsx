import SvgIcon from "@mui/material/SvgIcon";

export function Logo1Icon(props) {
  const fontSize = props.fontSize ?? "medium";
  return (
    <SvgIcon fontSize={fontSize}>
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M64 59C64 54.5817 67.5817 51 72 51H439.211C443.629 51 447.211 54.5817 447.211 59V235.142L439.215 417.737C439.028 422.015 435.505 425.387 431.223 425.387H79.988C75.7059 425.387 72.183 422.015 71.9957 417.737L64 235.142V59Z"
          fill="#673AB7"
        />
        <rect
          x="110.394"
          y="389.785"
          width="58.259"
          height="71.215"
          rx="5"
          fill="#673AB7"
        />
        <rect
          x="343.43"
          y="389.785"
          width="58.259"
          height="71.215"
          rx="5"
          fill="#673AB7"
        />
        <ellipse
          cx="139.288"
          cy="354.183"
          rx="36.4467"
          ry="35.6075"
          fill="#FFECB3"
        />
        <ellipse
          cx="372.338"
          cy="354.183"
          rx="36.4467"
          ry="35.6075"
          fill="#FFECB3"
        />
        <rect
          x="107.157"
          y="98.473"
          width="297.822"
          height="190.246"
          rx="8"
          fill="#F5F5F5"
        />
      </svg>
    </SvgIcon>
  );
}
