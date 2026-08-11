import React from "react";
import { useHits } from "react-instantsearch";

import Box from "@mui/material/Box";

import { SearchHit } from "../Home/SearchHit";

export function CustomHits(props) {
  const { items, sendEvent } = useHits(props);

  return (
    <Box>
      {items.map((hit) => (
        <SearchHit hit={hit} key={hit.objectID} />
      ))}
    </Box>
  );
}
