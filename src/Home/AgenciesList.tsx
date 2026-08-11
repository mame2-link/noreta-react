import Button from "@mui/material/Button";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import Stack from "@mui/material/Stack";

import { agencies } from "../Common/Agencies";

export function AgenciesList() {
  const list = [];
  agencies.forEach((agency) => {
    list.push(
      <Button
        key={agency.agency_id}
        startIcon={<DirectionsBusIcon sx={{ color: agency.agency_color }} />}
        href={agency.agency_url}
        size="small"
      >
        {agency.agency_name}
      </Button>
    );
  });
  return (
    <Stack direction="row" spacing={2}>
      {list}
    </Stack>
  );
}
