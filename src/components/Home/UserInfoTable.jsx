import React, { useEffect, useState } from "react";
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      const baseURL = process.env.REACT_APP_API_BASE_URL;

      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/admin/member`, {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setUsers(result.data.items);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  // 단건 유저 정보 가져오기
  const handleRowClick = async (user) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    try {
      const response = await fetch(`${baseURL}/admin/member/${user.memberId}`, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      // memberId를 result.data에 추가
      const userDataWithId = { ...result.data, memberId: user.memberId };
      setSelectedUser(userDataWithId); // 단건 정보 설정
      console.log(userDataWithId, "result.data with memberId");
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch single user data:", error);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.memberId === updatedUser.memberId ? updatedUser : user
      )
    );
    setSelectedUser(updatedUser);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const menuItems = [
    { text: "유저정보", path: "/" },
    { text: "카테고리", path: "/category" },
    { text: "후기", path: "/reviews" },
    { text: "문의답변", path: "/questions" },
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
          {loading ? (
            <Typography sx={{ textAlign: "center", p: 2 }}>
              로딩 중...
            </Typography>
          ) : (
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
                      key={user.memberId}
                      hover
                      onClick={() => handleRowClick(user)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{user.memberId}</TableCell>
                      <TableCell>{user.memberEmail}</TableCell>
                      <TableCell>{user.nickName}</TableCell>
                      <TableCell>{user.membershipType || "N/A"}</TableCell>
                      <TableCell>{user.points || 0}</TableCell>
                      <TableCell>{user.isUsable ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
        onUpdateUser={handleUpdateUser}
      />
    </Box>
  );
}
