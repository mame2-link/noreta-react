import Button from "@mui/material/Button";
// import NearMeIcon from "@mui/icons-material/NearMe";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";

export function SearchButtons() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
        my: 1,
      }}
    >
      <Button variant="contained" href="/search" endIcon={<SearchIcon />}>
        バス停名で検索
      </Button>
      <Button variant="contained" href="/location">
        位置情報から検索
      </Button>
    </Stack>
  );
}
