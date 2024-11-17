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
  Chip,
} from "@mui/material";
export default function UserInfoModal({
  selectedUser,
  setSelectedUser,
  modalOpen,
  setModalOpen,
  onUpdateUser,
}) {
  const [userData, setUserData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [gender, setGender] = useState("N");
  const [isAgreeAlarm, setIsAgreeAlarm] = useState(
    selectedUser?.isAgreeAlarm || false
  );
  const [userType, setUserType] = useState(selectedUser?.type || "N");

  useEffect(() => {
    setUserData(selectedUser || {});
    setGender(selectedUser?.gender || "N");
    setIsAgreeAlarm(selectedUser?.isAgreeAlarm || false);
    setUserType(selectedUser?.type || "N");
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
      uidIdArr: uidIdArr,
    };
    console.log(updatedData, "updatedData");

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
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
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ mr: 3, mb: 0 }}>
                  취향
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedUser?.uids?.map((uid) => (
                    <Chip key={uid.UIDid} label={uid.dc.dessertName} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ mr: 3, mb: 0 }}>
                  주소
                </Typography>
                <Typography variant="body2">
                  {`${selectedUser?.firstCity || ""} ${
                    selectedUser?.secondaryCity || ""
                  } ${selectedUser?.thirdCity || ""}`}
                </Typography>
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
