import React from "react";
import { TextField, Button, Box } from "@mui/material";

export default function SearchBar({ searchText, setSearchText, onSearch }) {
  return (
    <Box sx={{ display: "flex", gap: 2, p: 0 }}>
      <TextField
        label="카테고리 검색"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mr: 1, flexGrow: 1, p: 0 }}
      />
      <Button variant="contained" onClick={onSearch}>
        검색
      </Button>
    </Box>
  );
}
