import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Sidebar from "../../components/common/Sidebar";
import SearchBar from "../../components/Category/SearchBar";
import CategoryButtons from "../../components/Category/CategoryButtons";
import AddCategoryDialog from "../../components/Category/AddCategoryDialog";

export default function CategoryPage() {
  const [selectedMenu, setSelectedMenu] = useState("카테고리");
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState(""); // State for search input
  const [parentCategory, setParentCategory] = useState(null);

  // States for category selections
  const [firstLevelCategory, setFirstLevelCategory] = useState("");
  const [secondLevelCategory, setSecondLevelCategory] = useState("");
  const [thirdLevelCategory, setThirdLevelCategory] = useState("");
  const [fourthLevelCategory, setFourthLevelCategory] = useState("");

  // Categories data
  const categories = [
    {
      id: 1,
      name: "케이크",
      subCategories: [{ name: "마카롱" }, { name: "쿠키" }],
    },
    {
      id: 2,
      name: "빵",
      subCategories: [{ name: "식빵" }, { name: "크로와상" }],
    },
  ];

  // Filter the categories based on the search text
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoryName("");
  };

  const handleAddCategory = () => {
    console.log("Adding category:", {
      firstLevelCategory,
      secondLevelCategory,
      thirdLevelCategory,
      fourthLevelCategory,
    });
    handleCloseDialog();
  };

  const handleCategoryClick = (category) => {
    if (currentLevel === 1) {
      setSelectedCategory(category);
      setFirstLevelCategory(category.name);
      setCurrentLevel(2);
    } else if (currentLevel === 2) {
      setParentCategory(selectedCategory);
      setSelectedCategory(category);
      setSecondLevelCategory(category.name);
      setCurrentLevel(3);
    }
  };

  const handleBack = () => {
    if (currentLevel === 3) {
      setSelectedCategory(parentCategory);
      setCurrentLevel(2);
    } else if (currentLevel === 2) {
      setSelectedCategory(null);
      setCurrentLevel(1);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        menuItems={[
          { text: "유저정보", path: "/" },
          { text: "카테고리", path: "/category" },
          { text: "후기", path: "/reviews" },
          { text: "문의답변", path: "/questions" },
        ]}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        {/* Search Bar */}
        <Paper sx={{ mb: 2 }}>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </Paper>

        {/* Category Buttons */}
        <Paper sx={{ width: "100%", p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentLevel === 1
              ? "1차 카테고리"
              : currentLevel === 2
              ? "2차 카테고리"
              : "3차 카테고리"}
          </Typography>

          <CategoryButtons
            categories={filteredCategories} // Use filtered categories
            currentLevel={currentLevel}
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick}
            handleBack={handleBack}
            handleOpenDialog={handleOpenDialog}
          />
        </Paper>
      </Box>

      {/* Add Category Dialog */}
      <AddCategoryDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        firstLevelCategory={firstLevelCategory}
        secondLevelCategory={secondLevelCategory}
        setSecondLevelCategory={setSecondLevelCategory}
        thirdLevelCategory={thirdLevelCategory}
        setThirdLevelCategory={setThirdLevelCategory}
        fourthLevelCategory={fourthLevelCategory}
        setFourthLevelCategory={setFourthLevelCategory}
        currentLevel={currentLevel}
        handleAddCategory={handleAddCategory}
      />
    </Box>
  );
}
