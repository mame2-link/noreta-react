import { useEffect, useState } from "react";
import { /*useLocation,*/ useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import { agencies } from "../Common/Agencies";
import { CommonFooter } from "../Common/CommonFooter";

export default function VehicleSearch() {
  const navigate = useNavigate();
  const defaultValue = agencies.values().next().value.agency_id;
  const defaultVehicleId = "H974";
  const [agencyId, setAgencyId] = useState(defaultValue);
  const [vehicleId, setVehicleId] = useState(defaultVehicleId);

  // document.title = "車番検索";

  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", "車番検索");

  const handleClick = () => {
    const vehicle_id = agencyId + "-" + vehicleId;
    navigate("/vehicle/" + vehicle_id);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleId(event.currentTarget.value);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAgencyId(event.target.value);
  };
  const menuItem = [];

  for (const value of agencies.values()) {
    menuItem.push(
      <MenuItem key={value.agency_id} value={value.agency_id}>
        {value.agency_name}
      </MenuItem>
    );
  }

  // const location = useLocation();

  useEffect(() => {
    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: document.title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);

  return (
    <>
      <main>
        <Box sx={{ m: 2 }} component="form">
          <Stack spacing={2}>
            <FormControl>
              <InputLabel id="agency_name">事業者名</InputLabel>
              <Select
                labelId="agency_name"
                id="agency-select"
                name="agency_id"
                label="事業者名"
                defaultValue={defaultValue}
                onChange={handleChange}
              >
                {menuItem}
              </Select>
            </FormControl>
            <TextField
              required
              label="車番"
              variant="outlined"
              name="vehicle_id"
              placeholder="当サイトで表示している車番を入れてください"
              defaultValue={defaultVehicleId}
              onChange={handleInput}
            />
            <Button variant="contained" onClick={handleClick}>
              検索
            </Button>
          </Stack>
        </Box>
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
