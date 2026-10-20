import { useEffect } from "react";
// import { useLocation } from "react-router";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { CommonFooter } from "../Common/CommonFooter";
import { AgenciesList } from "../Home/AgenciesList";

export default function AdminInfo() {
  // title
  const title = "運営者情報 - noreta.net";

  useEffect(() => {
    // GA4
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
  }, []);

  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="description" content={title} />
      <main>
        <Typography component="h1" variant="h5" sx={{ m: 2 }}>
          運営者情報
        </Typography>
        <Typography sx={{ m: 2 }}>
          このWebサイトは日本で働くシステムエンジニア「mame2」が個人で運営しています。
          <Link href="https://www.odpt.org/">
            公共交通オープンデータセンター
          </Link>
          を使いバスの運行情報を表示しています。
        </Typography>
        <Box sx={{ m: 2 }}>
          <AgenciesList />
        </Box>
      </main>
      <CommonFooter></CommonFooter>
    </>
  );
}
