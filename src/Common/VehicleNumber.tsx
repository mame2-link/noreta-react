import Box from "@mui/material/Box";

export function VehicleNumber(props) {
  const vehicle_number = props.vehicle_number;
  return (
    <Box
      sx={{
        px: 1,
        display: "inline",
        borderRadius: 1,
        textAlign: "center",
        bgcolor: "info.main",
        color: "info.contrastText",
        typography: "subtitle2",
        whiteSpace: "nowrap",
      }}
    >
      {vehicle_number}
    </Box>
  );
}
