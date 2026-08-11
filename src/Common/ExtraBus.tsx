import Box from "@mui/material/Box";

export function ExtraBus() {
  return (
    <Box
      sx={{
        p: 1,
        display: "inline",
        borderRadius: 1,
        textAlign: "center",
        bgcolor: "error",
        color: "error.contrastText",
        typography: "subtitle2",
        whiteSpace: "nowrap",
      }}
    >
      臨時便
    </Box>
  );
}
