import { useEffect } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// import { DefaultSearchBox } from "./DefaultSearchBox";
// import { HomeFooter } from "./HomeFooter";
// import { AgenciesList } from "./AgenciesList";

// import { getStopsData } from "../Common/IndexedDb";

// import { RecentlyAccessStops } from "./RecentlyAccessStops";
// import { SearchButtons } from "./SearchButtons";

function Home() {
  // aws-amplify/analitycs
  // record({
  //   name: "homeVisit",
  // });

  // title
  const title = "バス運行情報 - t2.mame2.link";
  // window.title = title;

  // const [stops, setStops] = useState();

  // const location = useLocation();

  useEffect(() => {
    // getStopsData()
    //   .then((value) => {
    //     setStops(value);
    //   })
    //   .catch((e) => console.error(e));

    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);

  return (
    <>
      <title>{title}</title>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            バス運行情報
          </Typography>
          {/* <AgenciesList />
          <SearchButtons /> */}

          {/* <Box sx={{ m: 2 }}>
            <DefaultSearchBox />
          </Box> */}
        </Box>

        <Box sx={{ m: 2 }}>
          <Link href="/vehicle_search" variant="body2">
            車番検索
          </Link>
        </Box>
      </Container>
      {/* <Box sx={{ m: 2 }}>{stops && <RecentlyAccessStops stops={stops} />}</Box> */}
      <Box sx={{ my: 3 }}>
        <Container maxWidth="xs">
          {/* <HomeFooter></HomeFooter> */}
        </Container>
      </Box>
    </>
  );
}
export default Home;
