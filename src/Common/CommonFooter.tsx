import { Box, Link, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Logo1Icon } from "./Logo1Icon";

export function CommonFooter() {
  return (
    <footer>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <IconButton
          size="small"
          color="primary"
          href="/"
          aria-label="ホームに移動"
        >
          <Logo1Icon fontSize="small" />
        </IconButton>
        <Link href="/privacy" variant="body2">
          プライバシーポリシー
        </Link>
        <Box component="span" sx={{ typography: "body2" }}>
          {"© "}
          <Link href="/admn">mame2</Link> {new Date().getFullYear()}
          {"."}
        </Box>
      </Stack>
    </footer>
  );
}
