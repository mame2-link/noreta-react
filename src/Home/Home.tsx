import { useEffect, useState } from "react";
import { Schema } from "../../amplify/data/resource";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { HomeFooter } from "./HomeFooter";
import { AgenciesList } from "./AgenciesList";

import { getStopsData } from "../Common/IndexedDb";

import { RecentlyAccessStops } from "./RecentlyAccessStops";
import { SearchButtons } from "./SearchButtons";


function Home() {

  // title
  const title = "のれたネット - noreta.net";

  const [stops, setStops] = useState<Schema["Stop"]["type"][]>();

  // const location = useLocation();

  useEffect(() => {
    getStopsData()
      .then((value) => {
        setStops(value as Schema["Stop"]["type"][]);
      })
      .catch((e) => console.error(e));
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

          <AgenciesList />
          <SearchButtons />

        </Box>

        <Box sx={{ m: 2 }}>
          <Link href="/vehicle_search" variant="body2">
            車番検索
          </Link>
        </Box>
      </Container>
      <Box sx={{ m: 2 }}>{stops && <RecentlyAccessStops stops={stops} />}</Box>
      <Box sx={{ my: 3 }}>
        <Container maxWidth="xs">
          <HomeFooter></HomeFooter>
        </Container>
      </Box>
    </>
  );
}
export default Home;
