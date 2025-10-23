// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes, Link } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import EmailVerify from "./pages/EmailVerify";
import OAuth2Callback from "./pages/OAuth2Callback";

// Buddy
import BuddyList from "./pages/buddy/BuddyList";
import BuddyCreateForm from "./pages/buddy/BuddyCreateForm";
import BuddyPostDetail from "./pages/buddy/BuddyPostDetail";
import MyApplications from "./pages/buddy/MyApplications";
import Applicants from "./pages/buddy/Applicants";

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <nav
        style={{
          display: "flex",
          gap: "20px",
          padding: "12px 24px",
          borderBottom: "1px solid #eee",
          alignItems: "center",
        }}
      >
        <Link to="/">홈</Link>
        <Link to="/buddies">동행자 모집</Link>
        <Link to="/profile/1">내 프로필</Link>
      </nav>

      <Routes>
        {/* 공개 */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/email-verification" element={isAuthenticated ? <Navigate to="/" /> : <EmailVerify />} />

        {/* 보호 */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/profile/:userId" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/buddies" element={isAuthenticated ? <BuddyList /> : <Navigate to="/login" replace />} />
        <Route path="/buddies/new" element={isAuthenticated ? <BuddyCreateForm /> : <Navigate to="/login" replace />} />
        <Route path="/buddies/:id" element={isAuthenticated ? <BuddyPostDetail /> : <Navigate to="/login" replace />} />
        <Route path="/buddies/:id/applicants" element={isAuthenticated ? <Applicants /> : <Navigate to="/login" replace />} />
        <Route path="/buddies/my-applications" element={isAuthenticated ? <MyApplications /> : <Navigate to="/login" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
