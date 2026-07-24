import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Fab from "@mui/material/Fab";
import Toolbar from "@mui/material/Toolbar";
import UpdateIcon from "@mui/icons-material/Update";
import { styled } from "@mui/material/styles";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

export function BottomBar(props) {
  const location = useLocation();
  return (
    <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
      <Toolbar>
        <StyledFab
          color="secondary"
          aria-label="update"
          href={location.pathname}
        >
          <UpdateIcon />
        </StyledFab>
      </Toolbar>
    </AppBar>
  );
}
