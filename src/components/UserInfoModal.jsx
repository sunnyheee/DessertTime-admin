import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Modal,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tab,
  Tabs,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
export default function UserInfoModal({
  selectedUser,
  setSelectedUser,
  modalOpen,
  setModalOpen,
}) {
  const [tabValue, setTabValue] = useState(0);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-description"
    >
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Avatar sx={{ width: 80, height: 80 }}>프사</Avatar>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h6">{selectedUser?.nickname}</Typography>
              <Typography variant="body2">
                회원번호: {selectedUser?.id}
              </Typography>
              <Typography variant="body2">
                ID(email): {selectedUser?.email}
              </Typography>
              <Typography variant="body2">
                회원유형: {selectedUser?.membershipType}
              </Typography>
              <Typography variant="body2">
                보유 포인트: {selectedUser?.points} 일
              </Typography>
              <Typography variant="body2">
                회원여부: {selectedUser?.status}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="계정정보" />
              <Tab label="포인트" />
            </Tabs>
          </Box>
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="닉네임"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="관리자메모"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                성별
              </Typography>
              <RadioGroup row>
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="남성"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="여성"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="선택안함"
                />
              </RadioGroup>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                취향
              </Typography>
              <Box>
                {[
                  "1차카테고리",
                  "1차카테고리",
                  "1차카테고리",
                  "1차카테고리",
                  "1차카테고리",
                ].map((category, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox />}
                    label={category}
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="주소"
                variant="outlined"
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <FormControlLabel control={<Switch />} label="동의" />
                <FormControlLabel control={<Switch />} label="비동의" />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel control={<Switch />} label="Normal" />
                <FormControlLabel control={<Switch />} label="Pro" />
              </Box>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                프로필사진 삭제하기
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2, ml: 2 }}
              >
                계정 삭제하기
              </Button>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                포인트 관리
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                  label="포인트(일)"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, flexGrow: 1 }}
                />
                <Button variant="contained" color="success" sx={{ mr: 1 }}>
                  지급
                </Button>
                <Button variant="contained" color="error">
                  회수
                </Button>
              </Box>
              <Typography variant="h6" gutterBottom>
                HISTORY
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 300, overflow: "auto" }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>날짜</TableCell>
                      <TableCell>포인트</TableCell>
                      <TableCell>내용</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...Array(10)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>2024.05.09 18:06:42</TableCell>
                        <TableCell>+100</TableCell>
                        <TableCell>[매뉴얼11111] 후기 등록</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            저장하기
          </Button>
        </CardContent>
      </Card>
    </Modal>
  );
}
