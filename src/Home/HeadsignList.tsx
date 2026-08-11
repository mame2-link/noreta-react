import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { toHalfWidth } from "../Common/CommonFunc";

export function HeadsignList(props) {
  const list = props.headsign;
  const headsigns = [];
  const MAX = 10;

  for (const i in list) {
    if (i >= MAX) break;
    headsigns.push(
      <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            borderRadius: 1,
            bgcolor: "grey.900",
            color: "common.white",
          }}
        >
          {list[i]?.route_short_name && (
            <Box
              sx={{
                color: "secondary.main",
                border: 2,
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography sx={{ whiteSpace: "nowrap" }}>
                {toHalfWidth(list[i]?.route_short_name)}
              </Typography>
            </Box>
          )}
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
              m: 1,
            }}
          >
            {list[i]?.headsign}
          </Typography>
        </Box>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      {headsigns}
    </Grid>
  );
}
