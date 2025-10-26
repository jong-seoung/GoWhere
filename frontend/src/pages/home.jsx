import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import MainLayout from "../components/layout/MainLayout";
import Header from "../components/layout/Header";
import PostList from "../components/PostList";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <MainLayout>
      <Header onLogout={logout} />
      <div className="flex items-center justify-between p-4">
        <h1 className="font-bold text-2xl">여행 게시글 검색/정렬</h1>
        <button
          onClick={() => navigate("/write")}
          className="btn-primary px-4 py-2 rounded-md"
        >
          ✏️ 작성하기
        </button>
      </div>
      <PostList />
    </MainLayout>
  );
};

export default Home;
