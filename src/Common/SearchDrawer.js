import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { DefaultSearchBox } from "../Home/DefaultSearchBox";

export function SearchDrawer(props) {
  const isOpen = props.isOpen;
  const toggleDrawer = props.toggleDrawer;
  return (
    <Drawer anchor="top" open={isOpen} onClose={toggleDrawer(false)}>
      <Box
        role="presentation"
        sx={{ width: "auto" }}
        // onClick={toggleDrawer(false)}
        // onKeyDown={toggleDrawer(false)}
      >
        <DefaultSearchBox />
      </Box>
    </Drawer>
  );
}
