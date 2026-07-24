import { Box, Link } from "@mui/material";
import Stack from "@mui/material/Stack";

export function HomeFooter() {
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
        <Link href="/privacy" variant="body2">
          プライバシーポリシー
        </Link>
        <Link href="/terms" variant="body2">
          利用規約
        </Link>
        <Box variant="body2">
          {"© "}
          <Link href="/admn">mame2</Link> {new Date().getFullYear()}
          {"."}
        </Box>
      </Stack>
    </footer>
  );
}
