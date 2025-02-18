import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Paper,
  Grid,
  TextField,
  Chip,
  Toolbar,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import Sidebar from "../../components/common/Sidebar";

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]); // 리뷰 데이터 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [rowsPerPage, setRowsPerPage] = useState(10); // 페이지당 행 수
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [selectedReview, setSelectedReview] = useState(null); // 선택된 리뷰
  const [selectedReviews, setSelectedReviews] = useState([]); // 선택된 리뷰 리스트
  const [searchFilters, setSearchFilters] = useState({
    status: "",
    nickname: "",
    title: "",
  });
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const statusOptions = ["등록", "대기", "신고", "삭제"];

  const [categoryOptions, setCategoryOptions] = useState([]);

  const fetchCategories = async () => {
    try {
      const baseURL =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_BASE_URL // 개발 환경에서는 .env 파일 사용
          : "/api"; // Vercel 배포 환경에서는 프록시를 통해 API 요청

      const response = await fetch(`${baseURL}/dessert-category/all-list`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // nextCategory까지 포함하여 평탄화(Flatten)된 리스트 생성
        const flattenCategories = (categories) => {
          let allCategories = [];
          categories.forEach((category) => {
            allCategories.push({
              dessertCategoryId: category.dessertCategoryId,
              dessertName: category.dessertName,
              parentDCId: category.parentDCId,
            });
            if (
              Array.isArray(category.nextCategory) &&
              category.nextCategory.length > 0
            ) {
              allCategories = allCategories.concat(
                flattenCategories(category.nextCategory)
              );
            }
          });
          return allCategories;
        };

        const allCategories = flattenCategories(data.data);
        setCategoryOptions(allCategories); // 모든 카테고리 데이터 저장
      } else {
        console.error("Failed to load categories:", data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 컴포넌트 마운트 시 카테고리 가져오기
  useEffect(() => {
    fetchCategories();
  }, []);

  // API 호출 함수
  const fetchReviews = async () => {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_API_BASE_URL // 개발 환경에서는 .env 파일 사용
        : "/api"; // Vercel 배포 환경에서는 프록시를 통해 API 요청

    try {
      const queryParams = new URLSearchParams({
        pageNo: page,
        limitSize: rowsPerPage,
        status: searchFilters.status,
        nickname: searchFilters.nickname,
        title: searchFilters.title,
      });
      const response = await fetch(`${baseURL}/admin-review?${queryParams}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(data.data.items); // 데이터 설정
          setTotalPages(data.data.totalPage); // 총 페이지 수 설정
        } else {
          console.error("데이터 가져오기 실패:", data.message);
        }
      } else {
        console.error("HTTP 에러:", response.statusText);
      }
    } catch (error) {
      console.error("API 호출 에러:", error);
    }
  };

  // 데이터 가져오기
  useEffect(() => {
    fetchReviews();
  }, [page, rowsPerPage, searchFilters]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    console.log("수정된 데이터:", selectedReview);
    if (!selectedReview) return;

    try {
      const baseURL =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_BASE_URL
          : "/api";

      const response = await fetch(
        `${baseURL}/admin-review/${selectedReview.reviewId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId: selectedReview.reviewId,
            dessertCategoryId: selectedReview.dessertCategoryId || null,
            storeName: selectedReview.storeName || "",
            menuName: selectedReview.menuName || "",
            content: selectedReview.content || "",
            adminMemo: selectedReview.adminMemo || "",
            reviewIngredientIdArr:
              selectedReview.ingredients?.map((ing) => ing.id) || [],
            reviewImgs:
              selectedReview.reviewImgs?.map((img, index) => ({
                reviewImgId: img.id,
                num: index + 1,
                isMain: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
                isUsable: true,
              })) || [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        alert("리뷰가 성공적으로 수정되었습니다.");
        fetchReviews(); // 수정 후 목록 새로고침
        handleCloseModal(); // 모달 닫기
      } else {
        alert(`수정 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("리뷰 수정 중 에러 발생:", error);
      alert("리뷰 수정에 실패했습니다.");
    }

    handleCloseModal();
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedReviews(reviews.map((review) => review.reviewId));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSearch = () => {
    setPage(1);
    fetchReviews();
  };

  const handleSearchInputChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenReceiptDialog = (receipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptDialogOpen(true);
  };

  const handleCloseReceiptDialog = () => {
    setSelectedReceipt(null);
    setIsReceiptDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar
        selectedMenu={"후기"}
        setSelectedMenu={() => {}}
        menuItems={[
          { text: "유저정보", path: "/" },
          { text: "카테고리", path: "/category" },
          { text: "후기", path: "/reviews" },
          { text: "문의답변", path: "/questions" },
        ]}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
            p: 2,
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Select
              value={searchFilters.status}
              onChange={(e) =>
                handleSearchInputChange("status", e.target.value)
              }
              displayEmpty
              size="small"
              sx={{ width: 150 }}
            >
              <MenuItem value="">상태 선택</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="닉네임/ID(email)"
              size="small"
              value={searchFilters.nickname}
              onChange={(e) =>
                handleSearchInputChange("nickname", e.target.value)
              }
            />
            <TextField
              label="후기 제목/내용 검색"
              size="small"
              value={searchFilters.title}
              onChange={(e) => handleSearchInputChange("title", e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ alignSelf: "center" }}
            >
              검색
            </Button>
          </Box>
        </Box>
        <Toolbar sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("등록 클릭됨")}
          >
            등록
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => console.log("삭제 클릭됨", selectedReviews)}
          >
            삭제
          </Button>
        </Toolbar>
        <Paper sx={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 1500 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedReviews.length > 0 &&
                        selectedReviews.length < reviews.length
                      }
                      checked={
                        reviews.length > 0 &&
                        selectedReviews.length === reviews.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>상태</TableCell>
                  <TableCell>No.</TableCell>
                  <TableCell>닉네임(ID/email)</TableCell>
                  <TableCell>카테고리</TableCell>
                  <TableCell>재료</TableCell>
                  <TableCell>후기 제목</TableCell>
                  <TableCell>후기 내용</TableCell>
                  <TableCell>사진</TableCell>
                  <TableCell>신고내역</TableCell>
                  <TableCell>메모</TableCell>
                  <TableCell>영수증</TableCell>
                  <TableCell>액션</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.reviewId}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedReviews.includes(review.reviewId)}
                        onChange={() => handleSelectReview(review.reviewId)}
                      />
                    </TableCell>
                    <TableCell>{review.status}</TableCell>
                    <TableCell>{review.reviewId}</TableCell>
                    <TableCell>
                      {review.nickName}
                      <br />
                      <small>{review.memberEmail}</small>
                    </TableCell>
                    <TableCell>{review.dessertName}</TableCell>
                    <TableCell>
                      {review.ingredients.map((ingredient) => (
                        <div key={ingredient.id}>{ingredient.value}</div>
                      ))}
                    </TableCell>
                    <TableCell>{review.title}</TableCell>
                    <TableCell>{review.content}</TableCell>
                    <TableCell>
                      <Grid container spacing={1}>
                        {review.reviewImgs.map((img) => (
                          <Grid item key={img.id} xs={3}>
                            <img
                              // src={`http://138.2.122.18:3000${img.tgtImgName}`}
                              src={`/reviewImg/${img.tgtImgName
                                .split("/")
                                .pop()}`}
                              alt={img.orgImgName}
                              style={{ width: "100px", height: "auto" }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                    <TableCell>
                      {review.accusations.length > 0
                        ? review.accusations.map((acc, idx) => (
                            <div key={idx}>{`${
                              idx + 1
                            }차 신고사유: ${acc}`}</div>
                          ))
                        : "없음"}
                    </TableCell>
                    <TableCell>{review.adminMemo || "없음"}</TableCell>
                    <TableCell>
                      {review.receiptImgs.map((img) => (
                        <Button
                          key={img.id}
                          onClick={() => handleOpenReceiptDialog(img)}
                        >
                          영수증 보기
                        </Button>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenModal(review)}
                      >
                        수정하기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
        {/* 수정 모달 */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>후기 수정하기</DialogTitle>
          <DialogContent>
            {selectedReview && (
              <Box>
                {/* 기본 정보 (수정 불가) */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="후기번호"
                    margin="normal"
                    value={selectedReview.reviewId || ""}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="닉네임"
                    margin="normal"
                    value={selectedReview.nickName || ""}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="ID(이메일)"
                    margin="normal"
                    value={selectedReview.memberEmail || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Box>

                {/* 카테고리 선택 (수정 가능) */}
                <Box sx={{ mt: 2 }}>
                  <Typography>카테고리</Typography>
                  <Select
                    fullWidth
                    value={selectedReview.dessertCategoryId || ""}
                    onChange={(e) => {
                      const selectedCategory = categoryOptions.find(
                        (category) =>
                          category.dessertCategoryId === e.target.value
                      );
                      setSelectedReview((prev) => ({
                        ...prev,
                        dessertCategoryId: e.target.value,
                        dessertName: selectedCategory
                          ? selectedCategory.dessertName
                          : "",
                      }));
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">카테고리 선택</MenuItem>
                    {categoryOptions.map((category) => (
                      <MenuItem
                        key={category.dessertCategoryId}
                        value={category.dessertCategoryId}
                      >
                        {category.dessertName}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                {/* 가게명 & 메뉴명 */}
                <TextField
                  fullWidth
                  label="가게명"
                  margin="normal"
                  value={selectedReview.storeName || ""}
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      storeName: e.target.value,
                    }))
                  }
                />
                <TextField
                  fullWidth
                  label="메뉴명"
                  margin="normal"
                  value={selectedReview.menuName || ""}
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      menuName: e.target.value,
                    }))
                  }
                />

                {/* 재료 (ingredients) 표시 */}
                <Box sx={{ mt: 2 }}>
                  <Typography>재료</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedReview.ingredients?.length > 0 ? (
                      selectedReview.ingredients.map((ingredient, index) => (
                        <Chip key={index} label={ingredient.value} />
                      ))
                    ) : (
                      <Typography color="textSecondary">
                        재료 정보 없음
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* 후기 내용 입력 */}
                <TextField
                  fullWidth
                  label="후기 내용"
                  margin="normal"
                  multiline
                  rows={4}
                  value={selectedReview.content || ""}
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  sx={{ mt: 4 }}
                />

                {/* 이미지 리스트 */}
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedReview.reviewImgs?.map((img, index) => (
                    <Box key={index} sx={{ position: "relative" }}>
                      <img
                        src={`http://138.2.122.18:3000${img.tgtImgName}`}
                        alt={img.orgImgName}
                        style={{ width: "100px", height: "auto" }}
                      />
                      <Button
                        size="small"
                        onClick={() =>
                          setSelectedReview((prev) => ({
                            ...prev,
                            reviewImgs: prev.reviewImgs.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      >
                        X
                      </Button>
                    </Box>
                  ))}
                </Box>

                {/* 신고 내역 */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">신고 내역</Typography>
                  {selectedReview.accusations?.length > 0 ? (
                    <Box>
                      {selectedReview.accusations.map((acc, idx) => (
                        <TextField
                          key={idx}
                          fullWidth
                          margin="normal"
                          label={`${idx + 1}차 신고사유`}
                          value={acc}
                          InputProps={{ readOnly: true }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography color="textSecondary">
                      신고 내역이 없습니다.
                    </Typography>
                  )}
                </Box>

                {/* 관리자 메모 */}
                <TextField
                  fullWidth
                  label="메모"
                  margin="normal"
                  value={selectedReview.memo || ""}
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      memo: e.target.value,
                    }))
                  }
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>취소</Button>
            <Button variant="contained" onClick={handleSave}>
              저장
            </Button>
          </DialogActions>
        </Dialog>

        {/* 영수증 모달 */}
        <Dialog
          open={isReceiptDialogOpen}
          onClose={handleCloseReceiptDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>영수증 보기</DialogTitle>
          <DialogContent>
            {selectedReceipt && (
              <img
                src={`http://138.2.122.18:3000${selectedReceipt.tgtImgName}`}
                alt={selectedReceipt.orgImgName}
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReceiptDialog}>닫기</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
