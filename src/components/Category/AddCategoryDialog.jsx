import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

export default function AddCategoryDialog({
  open,
  handleClose,
  firstLevelCategory,
  secondLevelCategory,
  setSecondLevelCategory,
  thirdLevelCategory,
  setThirdLevelCategory,
  fourthLevelCategory,
  setFourthLevelCategory,
  currentLevel,
  handleAddCategory,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>카테고리 추가</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">1차 카테고리 (취향)</Typography>
          <TextField
            value={firstLevelCategory}
            InputProps={{ readOnly: true }}
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>

        {currentLevel >= 2 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">2차 카테고리 (종류)</Typography>
            <TextField
              placeholder="입력이 완료된 상태"
              fullWidth
              value={secondLevelCategory}
              onChange={(e) => setSecondLevelCategory(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        )}

        {currentLevel >= 3 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>주재료를 선택 해주세요.</InputLabel>
            <Select
              value={thirdLevelCategory}
              onChange={(e) => setThirdLevelCategory(e.target.value)}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="초콜릿">초콜릿</MenuItem>
              <MenuItem value="딸기">딸기</MenuItem>
              <MenuItem value="바닐라">바닐라</MenuItem>
            </Select>
          </FormControl>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">4차 카테고리 (메뉴명)</Typography>
          <TextField
            placeholder="메뉴명을 입력 해주세요."
            fullWidth
            value={fourthLevelCategory}
            onChange={(e) => setFourthLevelCategory(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleAddCategory} variant="contained" color="error">
          추가
        </Button>
      </DialogActions>
    </Dialog>
  );
}
