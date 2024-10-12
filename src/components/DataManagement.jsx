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
  Pagination,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
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
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 200;

export default function DataManagement() {
  const [page, setPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("유저정보");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const menuItems = ["유저정보", "카테고리", "후기", "문의답변"];

  const users = [
    {
      id: "135742",
      email: "desserttime.project@gmail.com",
      nickname: "프사",
      membershipType: "Normal/Pro",
      points: 3500,
      status: "Yes",
    },
    // Add more user data here...
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "grey.100",
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          {menuItems.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                selected={selectedMenu === text}
                onClick={() => setSelectedMenu(text)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "grey.300",
                  },
                }}
              >
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
          로그
        </Typography>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="검색범위"
              sx={{ mr: 1, width: 120 }}
            />
            <TextField
              variant="outlined"
              size="small"
              placeholder="검색어"
              sx={{ mr: 1, flexGrow: 1 }}
            />
            <Button variant="contained" startIcon={<SearchIcon />}>
              검색
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>회원번호</TableCell>
                  <TableCell>ID email</TableCell>
                  <TableCell>닉네임</TableCell>
                  <TableCell>회원유형</TableCell>
                  <TableCell>보유 포인트</TableCell>
                  <TableCell>회원여부</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    onClick={() => handleRowClick(user)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{user.membershipType}</TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>{user.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination count={10} page={page} onChange={handleChangePage} />
          </Box>
        </Paper>
      </Box>
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
            width: 400,
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
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{ mt: 2 }}
            >
              저장하기
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </Box>
  );
}
