import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
// import UserInfoTable from "./pages/UserInfoTable";
import CategoryPage from "./pages/Category/CategoryPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
// import Logs from "./pages/Logs";
import ReviewPage from "./pages/Review/ReviewPage";
// import Questions from "./pages/Questions";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/userinfo" element={<UserInfoTable />} /> */}
          <Route path="/category" element={<CategoryPage />} />
          {/* <Route path="/logs" element={<Logs />} /> */}
        <Route path="/reviews" element={<ReviewPage />} />
        {/* <Route path="/questions" element={<Questions />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
