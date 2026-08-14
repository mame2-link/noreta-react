import { useHits } from "react-instantsearch";

import Box from "@mui/material/Box";

import { SearchHit } from "../Home/SearchHit";
import { BaseHit } from "instantsearch.js";

export function CustomHits(props: BaseHit) {
  const { items, } = useHits(props);

  return (
    <Box>
      {items.map((hit) => (
        <SearchHit hit={hit} key={hit.objectID}/>
      ))}
    </Box>
  );
}
