import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import { history } from "instantsearch.js/es/lib/routers";
import { PoweredBy } from "react-instantsearch";

import Box from "@mui/material/Box";

import { CommonFooter } from "../Common/CommonFooter";
import { CustomSearchBox } from "./CustomSearchBox";
import { CustomHits } from "./CustomHits";
import { CustomPagination } from "./CustomPagination";

const searchClient = algoliasearch(
  "4QC6DKEQDN",
  "266e2d468394f84445aeba796968f816"
);

const routing = {
  router: history({ cleanUrlOnDispose: false }),
};

export default function Search() {

  return (
    <>
      <main>
        <Box sx={{ m: 2 }}>
          <InstantSearch
            searchClient={searchClient}
            future={{
              preserveSharedStateOnUnmount: false,
            }}
            indexName="stops-index"
            routing={routing}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomSearchBox />
            </Box>
            <CustomHits />
            <CustomPagination />
            <Box sx={{ width: 300 }}>
              <PoweredBy />
            </Box>
          </InstantSearch>
        </Box>
      </main>
      <Box sx={{ my: 2 }}>
        <CommonFooter></CommonFooter>
      </Box>
    </>
  );
}
