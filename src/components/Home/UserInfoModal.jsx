import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
export default function UserInfoModal({
  selectedUser,
  setSelectedUser,
  modalOpen,
  setModalOpen,
  onUpdateUser,
  onUserDelete,
}) {
  const [userData, setUserData] = useState({});
  const [pointHistory, setPointHistory] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [gender, setGender] = useState("N");
  const [isAgreeAlarm, setIsAgreeAlarm] = useState(
    selectedUser?.isAgreeAlarm || false
  );
  const [userType, setUserType] = useState(selectedUser?.type || "N");
  const [availableDessertCategories, setAvailableDessertCategories] = useState(
    []
  );

  const baseURL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_BASE_URL
      : "/api";

  useEffect(() => {
    setUserData(selectedUser || {});
    setGender(selectedUser?.gender || "N");
    setIsAgreeAlarm(selectedUser?.isAgreeAlarm || false);
    setUserType(selectedUser?.type || "N");
  }, [selectedUser]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseURL}/admin-dessert-category`);
        if (response.ok) {
          const data = await response.json();
          console.log("카테고리 데이터:", data); // 디버깅용 콘솔 출력
          setAvailableDessertCategories(data.data.items || []);
        } else {
          console.error("카테고리 조회 실패:", response.statusText);
        }
      } catch (error) {
        console.error("네트워크 오류:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedUser?.uids) {
      const initialUidIds = selectedUser.uids.map(
        (uid) => uid.dc.dessertCategoryId
      );
      setUserData((prevData) => ({ ...prevData, uidIdArr: initialUidIds }));
    }
  }, [selectedUser]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };
  const handleGenderChange = (value) => {
    setGender(value);
    setUserData((prevData) => ({ ...prevData, gender: value }));
  };
  const handleAlarmChange = (value) => {
    setIsAgreeAlarm(value);
    setUserData((prevData) => ({ ...prevData, isAgreeAlarm: value }));
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
    setUserData((prevData) => ({ ...prevData, type: value }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };
  const handleSave = async () => {
    if (!selectedUser || !selectedUser.memberId) {
      console.error("memberId가 없습니다. selectedUser를 확인하세요.");
      return;
    }
    const uidIdArr = userData.uids
      ? userData.uids.map((uid) => uid.dc.dessertCategoryId)
      : [];

    const updatedData = {
      nickName: userData.nickName,
      memo: userData.memo,
      gender: userData.gender,
      firstCity: userData.firstCity,
      secondaryCity: userData.secondaryCity,
      thirdCity: userData.thirdCity,
      type: userData.type,
      isAgreeAD: userData.isAgreeAD,
      isAgreeAlarm: userData.isAgreeAlarm,
      uidIdArr: userData.uidIdArr,
    };
    console.log(updatedData, "updatedData");

    try {
      const response = await fetch(
        `${baseURL}/admin/member/${selectedUser.memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Updated Data:", responseData);
        onUpdateUser(userData);
        handleCloseModal();
      } else {
        const errorResponse = await response.text();
        console.error("회원 정보 업데이트 중 오류:", errorResponse);
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
    }
  };

  useEffect(() => {
    if (selectedUser?.memberId) {
      const fetchPointHistory = async () => {
        try {
          const baseURL =
            process.env.NODE_ENV === "development"
              ? process.env.REACT_APP_API_BASE_URL
              : "/api";

          const response = await fetch(
            `${baseURL}/admin/point-history/${selectedUser.memberId}`
          );

          if (response.ok) {
            const data = await response.json();
            setPointHistory(data.data.items || []);
          } else {
            console.error("포인트 히스토리 조회 중 오류:", response.statusText);
          }
        } catch (error) {
          console.error("네트워크 오류:", error);
        }
      };

      fetchPointHistory();
    }
  }, [selectedUser]);

  const handleDeleteUser = async () => {
    if (!selectedUser || !selectedUser.memberId) {
      console.error("memberId가 없습니다. selectedUser를 확인하세요.");
      return;
    }

    try {
      const baseURL =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_BASE_URL
          : "/api";

      const response = await fetch(
        `${baseURL}/admin/member/${selectedUser.memberId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("회원 삭제 성공:", responseData);
        alert("회원이 성공적으로 삭제되었습니다.");
        onUserDelete(selectedUser.memberId); // 삭제된 사용자 제거
        handleCloseModal(); // Close the modal
      } else {
        const errorResponse = await response.text();
        console.error("회원 삭제 중 오류:", errorResponse);
        alert("회원 삭제에 실패하였습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
      alert("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    }
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
          width: "90%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            회원 정보 상세
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {selectedUser?.isHavingImg ? (
                <Avatar
                  src={selectedUser.profileImg}
                  sx={{ width: 80, height: 80 }}
                />
              ) : (
                <Avatar sx={{ width: 80, height: 80 }}>프사</Avatar>
              )}
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                회원번호: {selectedUser?.snsId || "N/A"}
              </Typography>
              <Typography variant="body2">
                ID(email): {selectedUser?.memberEmail || "N/A"}
              </Typography>
              <Typography variant="body2">
                회원유형: {selectedUser?.type || "N/A"}
              </Typography>
              <Typography variant="body2">
                보유 포인트: {selectedUser?.point || 0} 일
              </Typography>
              <Typography variant="body2">
                회원여부: {selectedUser?.isUsable ? "활성화됨" : "비활성화됨"}
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
                value={userData?.nickName || ""}
                onChange={(e) => handleInputChange("nickName", e.target.value)}
              />
              <TextField
                fullWidth
                label="관리자메모"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                value={userData?.memo || ""}
                onChange={(e) => handleInputChange("memo", e.target.value)}
              />
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mr: 3, mb: 0 }}
                >
                  성별
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant={gender === "M" ? "contained" : "outlined"}
                    onClick={() => handleGenderChange("M")}
                  >
                    남성
                  </Button>
                  <Button
                    variant={gender === "F" ? "contained" : "outlined"}
                    onClick={() => handleGenderChange("F")}
                  >
                    여성
                  </Button>
                  <Button
                    variant={gender === "N" ? "contained" : "outlined"}
                    onClick={() => handleGenderChange("N")}
                  >
                    선택안함
                  </Button>
                </Box>
              </Box>
              {/* <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ mr: 3, mb: 0 }}>
                  취향(TODO: 수정해야함)
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedUser?.uids?.map((uid) => (
                    <Chip key={uid.UIDid} label={uid.dc.dessertName} />
                  ))}
                </Box>
              </Box> */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  취향
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="취향 선택"
                  variant="outlined"
                  SelectProps={{
                    multiple: true,
                    value: userData?.uidIdArr || [],
                    onChange: (e) => {
                      const value = e.target.value;
                      setUserData((prevData) => ({
                        ...prevData,
                        uidIdArr: value,
                      }));
                    },
                    renderValue: (selected) =>
                      selected
                        .map((id) => {
                          const category = availableDessertCategories.find(
                            (item) => item.dessertCategoryId === id
                          );
                          return category ? category.dessertName : id;
                        })
                        .join(", "),
                  }}
                  helperText="취향을 선택하세요."
                >
                  {availableDessertCategories.map((category) => (
                    <MenuItem
                      key={category.dessertCategoryId}
                      value={category.dessertCategoryId}
                    >
                      {category.dessertName}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography variant="subtitle1" sx={{ mr: 3, mb: 0 }}>
                  주소
                </Typography>

                <Box>
                  <TextField
                    fullWidth
                    label="1차 지역"
                    variant="outlined"
                    margin="normal"
                    value={userData?.firstCity || ""}
                    onChange={(e) =>
                      handleInputChange("firstCity", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    label="2차 지역"
                    variant="outlined"
                    margin="normal"
                    value={userData?.secondaryCity || ""}
                    onChange={(e) =>
                      handleInputChange("secondaryCity", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    label="3차 지역"
                    variant="outlined"
                    margin="normal"
                    value={userData?.thirdCity || ""}
                    onChange={(e) =>
                      handleInputChange("thirdCity", e.target.value)
                    }
                  />
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mr: 3, mb: 0 }}
                >
                  알람 수신
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant={isAgreeAlarm ? "contained" : "outlined"}
                    color={isAgreeAlarm ? "primary" : "default"}
                    onClick={() => handleAlarmChange(true)}
                  >
                    동의
                  </Button>
                  <Button
                    variant={!isAgreeAlarm ? "contained" : "outlined"}
                    color={!isAgreeAlarm ? "primary" : "default"}
                    onClick={() => handleAlarmChange(false)}
                  >
                    비동의
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mr: 3, mb: 0 }}
                >
                  회원 유형
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant={userType === "N" ? "contained" : "outlined"}
                    color={userType === "N" ? "primary" : "default"}
                    onClick={() => handleUserTypeChange("N")}
                  >
                    Normal
                  </Button>
                  <Button
                    variant={userType === "P" ? "contained" : "outlined"}
                    color={userType === "P" ? "primary" : "default"}
                    onClick={() => handleUserTypeChange("P")}
                  >
                    Pro
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ mr: 3, mb: 0 }}
                >
                  계정 삭제하기
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#EF4444",
                    borderColor: "#EF4444",
                    backgroundColor: "white",
                    fontWeight: "semibold",
                    borderWidth: 1,
                    "&:hover": {
                      backgroundColor: "#f8d7da",
                      borderColor: "darkred",
                    },
                    borderRadius: 2,
                    padding: "8px 16px",
                  }}
                  onClick={handleDeleteUser}
                >
                  삭제하기
                </Button>
              </Box>
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
                    {pointHistory.length > 0 ? (
                      pointHistory.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            {item.points > 0 ? `+${item.points}` : item.points}
                          </TableCell>
                          <TableCell>{item.description}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          포인트 내역이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={handleSave}>
              저장하기
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
}
