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
  }, [page, rowsPerPage]);

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

  const handleSave = () => {
    console.log("수정된 데이터:", selectedReview);
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
                              src={`http://138.2.122.18:3000${img.tgtImgName}`}
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    fullWidth
                    label="후기번호"
                    margin="normal"
                    value={selectedReview.reviewId}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="닉네임"
                    margin="normal"
                    value={selectedReview.nickName}
                    onChange={(e) =>
                      setSelectedReview((prev) => ({
                        ...prev,
                        nickName: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    fullWidth
                    label="ID(이메일)"
                    margin="normal"
                    value={selectedReview.memberEmail}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    label="카테고리"
                    margin="normal"
                    value={selectedReview.dessertName}
                    onChange={(e) =>
                      setSelectedReview((prev) => ({
                        ...prev,
                        dessertName: e.target.value,
                      }))
                    }
                  />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  <Typography>재료</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {selectedReview.ingredients.map((ingredient, index) => (
                      <Chip key={index} label={ingredient.value} />
                    ))}
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  label="후기 내용"
                  margin="normal"
                  multiline
                  rows={4}
                  value={selectedReview.content}
                  onChange={(e) =>
                    setSelectedReview((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  sx={{
                    mt: 4,
                  }}
                />
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedReview.reviewImgs.map((img, index) => (
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
                <Box sx={{ mt: 2 }}>
                  <h4>신고 내역</h4>
                  {selectedReview.accusations.length > 0 ? (
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
                    <p>신고 내역이 없습니다.</p>
                  )}
                </Box>
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
