import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Header from "../../components/layout/Header";

const MainLayout = ({ children, className = "" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfilePage = () => {
    navigate(`/profile/${user?.id}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center">
      <Header onLogout={handleLogout} handleProfilePage={handleProfilePage} />
      <div className={`w-full relative mt-16 bg-gray-50 not-[]:${className}`}>{children}</div>
    </div>
  );
};

export default MainLayout;
