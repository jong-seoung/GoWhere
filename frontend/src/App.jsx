import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import EmailVerify from "./pages/EmailVerify";
import OAuth2Callback from "./pages/OAuth2Callback";

import BuddyHub from "./pages/buddy/BuddyHub";
import BuddyList from "./pages/buddy/BuddyList";
import BuddyCreateForm from "./pages/buddy/BuddyCreateForm";
import BuddyPostDetail from "./pages/buddy/BuddyPostDetail";
import MyApplications from "./pages/buddy/MyApplications";
import Applicants from "./pages/buddy/Applicants";

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile/:userId"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/email-verification"
          element={
            isAuthenticated ? <Navigate to="/" /> : <EmailVerify replace />
          }
        />

        {/* 동행자 허브/목록/상세 */}
        <Route path="/buddies" element={<BuddyHub />} />
        <Route path="/buddies/list" element={<BuddyList />} />
        <Route path="/buddies/:id" element={<BuddyPostDetail />} />

        {/* 보호 라우트 */}
        <Route
          path="/buddies/new"
          element={
            isAuthenticated ? <BuddyCreateForm replace /> : <Navigate to="/" />
          }
        />
        <Route
          path="/buddies/my-applications"
          element={
            isAuthenticated ? <MyApplications replace /> : <Navigate to="/" />
          }
        />
        <Route
          path="/buddies/:id/applicants"
          element={
            isAuthenticated ? <Applicants replace /> : <Navigate to="/" />
          }
        />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
