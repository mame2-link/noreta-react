// import { useLocation } from "react-router";
import type { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function StopName({ stop }: { stop: Schema["Stop"]["type"] }) {

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-around",
          // alignItems: "center",
          m: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography component="h1" variant="h6">
            <ruby>
              {stop.stop_name}
              <rp>(</rp>
              <rt>{stop.stop_kana}</rt>
              <rp>)</rp>
            </ruby>
          </Typography>
          {stop.platform_code && (
            <Box
              sx={{
                ml: 1,
                px: 1,
                bgcolor: "primary.main",
                color: "#ffffff",
                borderRadius: 5,
              }}
            >
              <Typography component="h2" variant="h6">
                {stop.platform_code}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </>
  );
}
