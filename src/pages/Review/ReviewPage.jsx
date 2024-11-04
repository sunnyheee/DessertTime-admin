import React, { useState } from "react";
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
  TablePagination,
  TextField,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Sidebar from "../../components/common/Sidebar";

// Sample data for reviews
const initialReviews = [
  {
    id: "240501004",
    status: "대기",
    no: "240501-00004",
    nickname: "디티닷넷임",
    email: "dt_test@naver.com",
    category: "2차카테고리",
    materials: ["재료명", "재료명", "재료명"],
    title: "메장명",
    content: "후기내용후기내용",
    photos: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    reportHistory: "",
    memo: "",
    receipt: "/placeholder.svg?height=200&width=150",
    createdAt: "2024.07.04",
  },
  {
    id: "240501003",
    status: "신고",
    no: "240501-00003",
    nickname: "신고된사용자",
    email: "reported@example.com",
    category: "2차카테고리",
    materials: ["재료명", "재료명"],
    title: "신고된 후기입니다",
    content: "부적절한 내용이 포함된 후기내용",
    photos: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    reportHistory: "욕설/비방",
    memo: "신고 처리 진행중",
    receipt: "/placeholder.svg?height=200&width=150",
    createdAt: "2024.07.03",
  },
  {
    id: "240501002",
    status: "등록",
    no: "240501-00002",
    nickname: "확인완료",
    email: "confirmed@example.com",
    category: "2차카테고리",
    materials: ["재료명", "재료명", "재료명", "재료명"],
    title: "확인완료된 후기",
    content: "관리자 확인이 완료된 후기내용입니다",
    photos: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    reportHistory: "",
    memo: "컨텐츠 검토 완료",
    receipt: "/placeholder.svg?height=200&width=150",
    createdAt: "2024.07.02",
  },
  {
    id: "240501001",
    status: "삭제",
    no: "240501-00001",
    nickname: "삭제된계정",
    email: "deleted@example.com",
    category: "2차카테고리",
    materials: ["재료명"],
    title: "삭제된 후기",
    content: "관리자에 의해 삭제된 후기입니다",
    photos: ["/placeholder.svg?height=100&width=100"],
    reportHistory: "불법광고",
    memo: "240706_후기내용이 광고성 컨텐츠를 포함하여 삭제됨",
    receipt: "/placeholder.svg?height=200&width=150",
    createdAt: "2024.07.01",
  },
];

export default function ReviewPage() {
  const [selectedMenu, setSelectedMenu] = useState("후기");
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleOpenModal = (review = null) => {
    setSelectedReview(
      review
        ? { ...review }
        : {
            photos: [],
            receipt: null,
          }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setSelectedReview((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...newPhotos].slice(0, 4),
    }));
  };

  const handleReceiptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedReview((prev) => ({
        ...prev,
        receipt: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemovePhoto = (index) => {
    setSelectedReview((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveReceipt = () => {
    setSelectedReview((prev) => ({
      ...prev,
      receipt: null,
    }));
  };

  const handleSaveReview = () => {
    if (selectedReview.id) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === selectedReview.id ? selectedReview : review
        )
      );
    } else {
      setReviews((prev) => [
        ...prev,
        { ...selectedReview, id: Date.now().toString() },
      ]);
    }
    handleCloseModal();
  };

  const handleOpenReceiptModal = (receipt) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedReceipt(null);
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <h1>리뷰 관리</h1>
          <Button variant="contained" onClick={() => handleOpenModal()}>
            새 리뷰 작성
          </Button>
        </Box>
        <Paper
          sx={{
            flexGrow: 1,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TableContainer sx={{ flexGrow: 1, overflow: "auto" }}>
            <Table stickyHeader sx={{ minWidth: 1500 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
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
                {reviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((review) => (
                    <TableRow key={review.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>{review.status}</TableCell>
                      <TableCell>{review.no}</TableCell>
                      <TableCell>
                        {review.nickname}
                        <br />
                        <small>{review.email}</small>
                      </TableCell>
                      <TableCell>{review.category}</TableCell>
                      <TableCell>
                        {review.materials.map((material, index) => (
                          <div key={index}>{material}</div>
                        ))}
                      </TableCell>
                      <TableCell>{review.title}</TableCell>
                      <TableCell>{review.content}</TableCell>
                      <TableCell>
                        <Grid container spacing={1}>
                          {review.photos.map((photo, index) => (
                            <Grid item key={index} xs={3}>
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                style={{ width: "100%", height: "auto" }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                      <TableCell>{review.reportHistory}</TableCell>
                      <TableCell>{review.memo}</TableCell>
                      <TableCell>
                        {review.receipt && (
                          <img
                            src={review.receipt}
                            alt="Receipt"
                            style={{
                              width: "100px",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleOpenReceiptModal(review.receipt)
                            }
                          />
                        )}
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
          <TablePagination
            component="div"
            count={reviews.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / 총 ${count}개`
            }
            labelRowsPerPage="페이지당 행 수:"
          />
        </Paper>
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedReview?.id ? "리뷰 수정" : "새 리뷰 작성"}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "grid", gap: 2, mt: 2 }}>
              <TextField
                label="후기번호"
                value={selectedReview?.no || ""}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="닉네임"
                value={selectedReview?.nickname || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    nickname: e.target.value,
                  }))
                }
              />
              <TextField
                label="이메일"
                value={selectedReview?.email || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
              <TextField
                label="카테고리"
                value={selectedReview?.category || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
              <TextField
                label="재료"
                value={selectedReview?.materials?.join(", ") || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    materials: e.target.value.split(", "),
                  }))
                }
              />
              <TextField
                label="후기 제목"
                value={selectedReview?.title || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <TextField
                label="후기 내용"
                multiline
                rows={4}
                value={selectedReview?.content || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="photo-upload"
                  multiple
                  type="file"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload">
                  <Button variant="outlined" component="span">
                    사진 업로드 (최대 4장)
                  </Button>
                </label>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {selectedReview?.photos?.map((photo, index) => (
                    <Grid item key={index} xs={3}>
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bgcolor: "background.paper",
                          }}
                          size="small"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <TextField
                label="신고내역"
                value={selectedReview?.reportHistory || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    reportHistory: e.target.value,
                  }))
                }
              />
              <TextField
                label="메모"
                multiline
                rows={2}
                value={selectedReview?.memo || ""}
                onChange={(e) =>
                  setSelectedReview((prev) => ({
                    ...prev,
                    memo: e.target.value,
                  }))
                }
              />
              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="receipt-upload"
                  type="file"
                  onChange={handleReceiptUpload}
                />
                <label htmlFor="receipt-upload">
                  <Button variant="outlined" component="span">
                    영수증 업로드
                  </Button>
                </label>
                {selectedReview?.receipt && (
                  <Box
                    sx={{
                      mt: 1,
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <img
                      src={selectedReview.receipt}
                      alt="Receipt"
                      style={{
                        width: "100px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleOpenReceiptModal(selectedReview.receipt)
                      }
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bgcolor: "background.paper",
                      }}
                      size="small"
                      onClick={handleRemoveReceipt}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>취소</Button>
            <Button variant="contained" onClick={handleSaveReview}>
              {selectedReview?.id ? "수정하기" : "작성하기"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isReceiptModalOpen}
          onClose={handleCloseReceiptModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>영수증</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              {selectedReceipt && (
                <img
                  src={selectedReceipt}
                  alt="Receipt"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReceiptModal}>닫기</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
