import { useEffect } from "react";
import { useLocation } from "react-router";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { CommonFooter } from "../Common/CommonFooter";
import { AgenciesList } from "../Home/AgenciesList";

export default function AdminInfo() {
  // title
  const title = "運営者情報 - t2.mame2.link";
  // document.title = title;

  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

  const location = useLocation();

  useEffect(() => {
    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);

  return (
    <>
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
