import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function AddCategoryDialog({
  open,
  handleClose,
  handleAddCategory,
  selectedCategory,
}) {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = () => {
    if (!categoryName.trim()) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }
    handleAddCategory(categoryName);
    setCategoryName("");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>2차 카테고리 추가</DialogTitle>
      <DialogContent>
        {/* 고정된 1차 카테고리 표시 */}
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          상위 카테고리: <strong>{selectedCategory?.dessertName}</strong>
        </Typography>
        <TextField
          fullWidth
          label="2차 카테고리 이름"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          추가하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
