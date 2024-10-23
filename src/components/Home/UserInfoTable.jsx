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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UserInfoModal from "./UserInfoModal";
import Sidebar from "../common/Sidebar"; // Sidebar 컴포넌트 사용

export default function UserInfoTable() {
  const [page, setPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("유저정보");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const menuItems = [
    { text: "유저정보", path: "/" },
    { text: "카테고리", path: "/category" },
    { text: "후기", path: "/reviews" },
    { text: "문의답변", path: "/questions" },
  ];

  const users = [
    {
      id: "135742",
      email: "desserttime.project@gmail.com",
      nickname: "프사",
      membershipType: "Normal/Pro",
      points: 3500,
      status: "Yes",
    },
    // 추가 유저 데이터를 여기다 넣을 수 있습니다...
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar 컴포넌트 사용 */}
      <Sidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        menuItems={menuItems}
      />
      {/* 메인 콘텐츠 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto" }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
          유저 로그
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
      <UserInfoModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </Box>
  );
}
