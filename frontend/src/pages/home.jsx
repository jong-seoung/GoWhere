import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import MainLayout from "../components/layout/MainLayout";
import Header from "../components/layout/Header";
import PostList from "../components/PostList"; // ✅ 수정된 경로

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  console.log("Home user:", user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <MainLayout>
      <Header onLogout={handleLogout} />
      <div style={{ minHeight: "100vh", background: "#f7f7f7" }}>
        <h1 style={{ fontWeight: 800, fontSize: 24, padding: 16 }}>
          여행 게시글 검색/정렬
        </h1>
        <PostList />
      </div>
    </MainLayout>
  );
};

export default Home;
