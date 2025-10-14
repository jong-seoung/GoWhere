import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import MainLayout from "../components/layout/MainLayout";
import Header from "../components/layout/Header";

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
    </MainLayout>
  );
};

export default Home;
