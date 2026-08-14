import { useState, useRef, useEffect } from "react";
// import { useLocation } from "react-router";

import { useInstantSearch, useSearchBox } from "react-instantsearch";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";

// import DOMPurify from 'dompurify';
import { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";

export function CustomSearchBox(props: SearchBoxConnectorParams) {
  const { query, refine } = useSearchBox(props);
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearchStalled = status === "stalled";

  // const q = DOMPurify.sanitize(inputValue);

  // let title = "バス停検索";
  // if (q && q.length > 0) {
  //   title = q + " - バス停検索";
  // }
  // document.title = title;

  // description
  // document
  //   .querySelector('meta[name="description"]')
  //   .setAttribute("content", title);

  // const location = useLocation();

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);

    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'search', { search_term: DOMPurify.sanitize(newQuery) })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }

  useEffect(() => {
    // GA4
    // window.gtag('js', new Date());
    // window.gtag('event', 'page_view', { page_title: title, page_location: location.pathname + location.search })
    // window.gtag('config', 'G-L8YDJSX9JX');
  }, []);


  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
          action=""
          role="search"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (inputRef.current) {
              inputRef.current.blur();
            }
          }}
          onReset={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setQuery("");

            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            inputRef={inputRef}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="バス停名で検索"
            spellCheck={false}
            type="search"
            value={inputValue}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            inputProps={{ maxLength: 512 }}
            autoFocus
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <span hidden={!isSearchStalled}>検索中...</span>
        </Paper>
      </Stack>
    </Box>
  );
}
