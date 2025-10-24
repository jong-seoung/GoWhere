import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";

import Home from "./pages/Home";
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

function Protected({ children }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* 동행자 허브/목록/상세 */}
        <Route path="/buddies" element={<BuddyHub />} />
        <Route path="/buddies/list" element={<BuddyList />} />
        <Route path="/buddies/:id" element={<BuddyPostDetail />} />

        {/* 보호 라우트 */}
        <Route
          path="/buddies/new"
          element={
            <Protected>
              <BuddyCreateForm />
            </Protected>
          }
        />
        <Route
          path="/buddies/my-applications"
          element={
            <Protected>
              <MyApplications />
            </Protected>
          }
        />
        <Route
          path="/buddies/:id/applicants"
          element={
            <Protected>
              <Applicants />
            </Protected>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
