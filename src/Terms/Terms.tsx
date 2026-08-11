import { useEffect } from "react";
import { useLocation } from "react-router";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CommonFooter } from "../Common/CommonFooter";

export default function Terms() {
  // title
  // const title = "利用規約 - t2.mame2.link";
  // document.title = title;

  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

  // const location = useLocation();

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
          利用規約
        </Typography>
        <Typography sx={{ m: 2 }}>最終更新日: 2023年11月1日</Typography>
        <Typography sx={{ m: 2 }}>
          このサービス（以下「本サービス」）をご利用いただきありがとうございます。
          本サービスを利用することにより、本規約に同意することになります。以下を注意してお読みください。
          本サービスを不正に利用しないでください。本サービスで提供している情報、
          リンク先などによりいかなる損失や損害などの被害が発生しても、本サービスでは責任を負いません。
        </Typography>
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
