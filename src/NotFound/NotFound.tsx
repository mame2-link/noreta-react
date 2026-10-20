import { useEffect } from "react";
// import { useLocation } from "react-router";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  // title
  const title = "404 ページがありません🥹 - noreta.net";

  useEffect(() => {
    window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
  }, []);

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={title} />
      <main>
        <Typography sx={{ m: 1 }}>404 ページがありません🥹</Typography>
        <Link href="/" sx={{ m: 1 }}>
          ホームへ行く
        </Link>
      </main>
    </>
  );
}
