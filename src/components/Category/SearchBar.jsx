import React from "react";
import { Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ searchText, setSearchText, handleSearch }) {
  return (
    <Box sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="카테고리 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mr: 1, flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          검색
        </Button>
      </Box>
    </Box>
  );
}
