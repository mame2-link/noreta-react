import { useEffect } from "react";
// import { useLocation } from "react-router";

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  // title
  const title = "404 ページがありません🥹 - noreta.net";
  // document.title = title;

  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

  // const location = useLocation();

  useEffect(() => {
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);

  return (
    <>
      <title>{title}</title>
      <main>
        <Typography sx={{ m: 1 }}>404 ページがありません🥹</Typography>
        <Link href="/" sx={{ m: 1 }}>
          ホームへ行く
        </Link>
      </main>
    </>
  );
}
