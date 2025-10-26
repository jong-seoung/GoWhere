import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuthStore from "./store/authStore";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import EmailVerify from "./pages/EmailVerify";
import OAuth2Callback from "./pages/OAuth2Callback";
import ReviewList from "./pages/ReviewList";
import ReviewPage from "./pages/ReviewPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import ReviewForm from "./components/ReviewForm";
import BookmarkPage from "./pages/BookmarkPage";

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
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
        <Route
          path="/reviews"
          element={
            isAuthenticated ? <ReviewPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reviews/new"
          element={
            isAuthenticated ? <ReviewForm /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reviews/:id"
          element={
            isAuthenticated ? <ReviewDetailPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/reviews/:id/edit"
          element={
            isAuthenticated ? <ReviewForm /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/bookmarks"
          element={
            isAuthenticated ? <BookmarkPage /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
