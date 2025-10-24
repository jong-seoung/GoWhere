import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Header from "./Header";

const MainLayout = ({ children, className = "" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfilePage = () => {
    if (user?.id) navigate(`/profile/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center">
      <Header
        onLogout={user ? handleLogout : undefined}
        handleProfilePage={handleProfilePage}
      />
      <div className={`w-full relative mt-16 bg-gray-50 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
