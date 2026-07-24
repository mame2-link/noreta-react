import React, { useState, useRef } from "react";

import {
  useInstantSearch,
  useSearchBox,
  useHits,
  Hits,
  SearchBox,
} from "react-instantsearch";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export function CustomComboBox(props) {
  const { query, refine } = useSearchBox();
  // const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState("");
  // const inputRef = useRef(null);
  const { items, sendEvent } = useHits([]);
  // const [options, setOptions] = useState([]);

  // const isSearchStalled = status === "stalled";

  function setQuery(event, newQuery) {
    console.log(newQuery);
    setInputValue(newQuery);
    refine(newQuery);
    // setOptions(items);
  }

  return (
    <Autocomplete
      value={inputValue}
      options={items}
      sx={{ width: 300 }}
      getOptionLabel={(option) => option.objectID}
      renderInput={(params) => (
        <TextField {...params} label="バス停名で検索検索" />
      )}
      // renderOption={(props, option) => {
      //   const { key, ...optionProps } = props;
      //   return (
      //     <li key={key} {...optionProps}>
      //       {option.stopName}
      //     </li>
      //   );
      // }}
      onInputChange={(event, newInputValue) => {
        setQuery(event, newInputValue);
      }}
    />
  );
}
