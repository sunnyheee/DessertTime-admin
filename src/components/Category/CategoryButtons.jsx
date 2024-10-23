import React from "react";
import { Grid, Button, Box, Typography } from "@mui/material";

export default function CategoryButtons({
  categories,
  currentLevel,
  selectedCategory,
  handleCategoryClick,
  handleBack,
  handleOpenDialog,
}) {
  const renderButtons = () => {
    if (currentLevel === 1) {
      return (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item key={category.id}>
              <Button
                variant="outlined"
                onClick={() => handleCategoryClick(category)}
                sx={{ minWidth: "150px", height: "50px" }}
              >
                {category.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      );
    } else if (currentLevel === 2 && selectedCategory?.subCategories) {
      return (
        <Grid container spacing={2}>
          {selectedCategory.subCategories.map((sub, index) => (
            <Grid item key={index}>
              <Button
                variant="outlined"
                onClick={() => handleCategoryClick(sub)}
                sx={{ minWidth: "150px", height: "50px" }}
              >
                {sub.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      );
    } else if (currentLevel === 3 && selectedCategory) {
      return (
        <Box>
          <Typography>선택된 카테고리: {selectedCategory.name}</Typography>
        </Box>
      );
    }
  };

  return (
    <Box>
      {currentLevel > 1 && (
        <Button variant="contained" onClick={handleBack} sx={{ mb: 2 }}>
          이전 단계로 돌아가기
        </Button>
      )}

      {renderButtons()}

      {currentLevel > 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" onClick={handleOpenDialog}>
            추가
          </Button>
        </Box>
      )}
    </Box>
  );
}
