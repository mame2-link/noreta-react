import { useNavigate } from "react-router";

import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

export function DefaultSearchBox() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = formData.get("q");
    const searchUrl = "/search?stops-index%5Bquery%5D=" + q;
    navigate(searchUrl);
  };

  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      role="search"
      noValidate
      onSubmit={handleSubmit}
      onReset={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="バス停名で検索"
        spellCheck={false}
        maxLength={512}
        type="search"
        name="q"
        autoFocus
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
