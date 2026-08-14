import { Box, Link, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Logo1Icon } from "../Common/Logo1Icon";

export function PrivacyPolicyFooter() {
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
        <Link href="/terms" variant="body2">
          利用規約
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
