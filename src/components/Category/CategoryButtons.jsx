import React from "react";
import { Grid, Button, Box } from "@mui/material";

export default function CategoryButtons({
  categories,
  currentLevel,
  selectedCategory,
  highlightedCategory, // 강조된 카테고리 ID
  handleCategoryClick,
  handleBack,
  handleOpenDialog,
}) {
  return (
    <Box>
      {/* 뒤로가기 버튼 */}
      {currentLevel > 1 && (
        <Button variant="contained" onClick={handleBack} sx={{ mb: 2 }}>
          이전 단계로 돌아가기
        </Button>
      )}

      {/* 카테고리 버튼 */}
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item key={category.dessertCategoryId}>
            <Button
              variant="outlined"
              onClick={() => handleCategoryClick(category)}
              sx={{
                minWidth: "150px",
                borderColor: "#f44336", // 테두리 색상은 빨간색 고정
                color: "#f44336", // 글자 색상도 빨간색
                backgroundColor:
                  highlightedCategory === category.dessertCategoryId
                    ? "#ffebee" // 강조된 버튼은 연한 빨간 배경
                    : "transparent",
                "&:hover": {
                  backgroundColor: "#ffcdd2", // hover 시 더 진한 빨간 배경
                },
              }}
            >
              {category.dessertName}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* 추가 버튼 */}
      {currentLevel === 2 && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleOpenDialog}>
            카테고리 추가
          </Button>
        </Box>
      )}
    </Box>
  );
}
