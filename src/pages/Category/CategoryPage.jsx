import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Breadcrumbs, Link } from "@mui/material";
import Sidebar from "../../components/common/Sidebar";
import SearchBar from "../../components/Category/SearchBar";
import CategoryButtons from "../../components/Category/CategoryButtons";
import AddCategoryDialog from "../../components/Category/AddCategoryDialog";

export default function CategoryPage() {
  const [selectedMenu, setSelectedMenu] = useState("카테고리");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [highlightedCategory, setHighlightedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(selectedCategory, "selectedCategory");

  useEffect(() => {
    loadCategories();
  }, []);

  // 1차 카테고리 불러오기
  const loadCategories = async () => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_API_BASE_URL // 개발 환경에서는 .env 파일 사용
        : "/api"; // Vercel 배포 환경에서는 프록시를 통해 API 요청

    try {
      const response = await fetch(`${baseURL}/dessert-category/all-list`, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (!response.ok) throw new Error("카테고리 불러오기 실패");

      const data = await response.json();
      setCategories(data.data || []);
      setFilteredCategories(data.data || []);
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };

  // 카테고리 클릭 시 2차 카테고리 표시
  const handleCategoryClick = (category) => {
    if (currentLevel === 1 && category.nextCategory.length > 0) {
      setFilteredCategories(category.nextCategory);
      setSelectedCategory(category);
      setCurrentLevel(2);
    }
  };

  // 빵크럼에서 1차 카테고리로 돌아가기
  const handleBackToFirstLevel = () => {
    setFilteredCategories(categories);
    setSelectedCategory(null);
    setCurrentLevel(1);
    setHighlightedCategory(null);
  };

  const handleAddCategory = async (categoryName) => {
    const isFirstLevel = currentLevel === 1;

    try {
      const baseURL =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_BASE_URL
          : "/api";

      const response = await fetch(`${baseURL}/admin-dessert-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          sessionNum: isFirstLevel ? 1 : 2,
          parentDCId: isFirstLevel ? 0 : selectedCategory.dessertCategoryId,
          dessertName: categoryName,
        }),
      });

      if (!response.ok) throw new Error("카테고리 추가 실패");

      const result = await response.json();
      if (result.success) {
        alert("카테고리가 성공적으로 추가되었습니다.");
        // 상태 유지
        await loadCategories();
        if (!isFirstLevel && selectedCategory) {
          const updatedCategory = categories.find(
            (cat) =>
              cat.dessertCategoryId === selectedCategory.dessertCategoryId
          );
          setSelectedCategory(updatedCategory);
          setFilteredCategories(updatedCategory?.nextCategory || []);
          setCurrentLevel(2); // 유지
        }
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("카테고리 추가 중 오류가 발생했습니다.");
    } finally {
      setOpenDialog(false);
    }
  };

  // 검색 기능
  const handleSearch = () => {
    if (!searchText.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    let foundCategory = null;

    // 1차 카테고리 검색
    for (let category of categories) {
      if (category.dessertName.includes(searchText)) {
        foundCategory = category;
        break;
      }

      // 2차 카테고리 검색
      for (let subCategory of category.nextCategory) {
        if (subCategory.dessertName.includes(searchText)) {
          setSelectedCategory(category);
          setFilteredCategories(category.nextCategory);
          setCurrentLevel(2);
          foundCategory = subCategory;
          break;
        }
      }

      if (foundCategory) break;
    }

    if (foundCategory) {
      setHighlightedCategory(foundCategory.dessertCategoryId);
    } else {
      alert("해당 카테고리를 찾을 수 없습니다.");
      setHighlightedCategory(null);
    }
  };

  const menuItems = [
    { text: "유저정보", path: "/" },
    { text: "카테고리", path: "/category" },
    { text: "후기", path: "/reviews" },
    { text: "문의답변", path: "/questions" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        menuItems={menuItems}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* 검색 바 */}
        <Paper sx={{ mb: 2, p: 2 }}>
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            onSearch={handleSearch}
          />
        </Paper>

        {/* 카테고리 버튼 */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentLevel === 1 ? "1차 카테고리" : "2차 카테고리"}
          </Typography>
          {/* 빵크럼 (Breadcrumbs) */}
          {currentLevel > 1 && (
            <Box sx={{ mb: 2 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  color="inherit"
                  onClick={handleBackToFirstLevel}
                  sx={{ cursor: "pointer" }}
                >
                  1차 카테고리
                </Link>
                {selectedCategory && (
                  <Typography color="text.primary">
                    {selectedCategory.dessertName}
                  </Typography>
                )}
              </Breadcrumbs>
            </Box>
          )}
          <CategoryButtons
            categories={filteredCategories}
            currentLevel={currentLevel}
            highlightedCategory={highlightedCategory}
            handleCategoryClick={handleCategoryClick}
            handleBack={handleBackToFirstLevel}
            handleOpenDialog={() => setOpenDialog(true)}
          />
        </Paper>
      </Box>

      <AddCategoryDialog
        selectedCategory={selectedCategory}
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleAddCategory={handleAddCategory}
      />
    </Box>
  );
}
