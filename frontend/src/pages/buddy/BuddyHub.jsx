import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import MainLayout from "../../components/layout/MainLayout";

export default function BuddyHub() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const goCreate = () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    navigate("/buddies/new");
  };

  const goBrowse = () => {
    navigate("/buddies/list"); // 비로그인 열람 가능
  };

  return (
    <MainLayout className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">동행자</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={goCreate}
            className="w-full rounded-xl border bg-white p-6 text-left hover:shadow-md transition"
          >
            <div className="text-xl font-semibold">모집글 작성</div>
            <div className="mt-1 text-slate-500 text-sm">
              여행 동행자를 모집하는 글을 등록합니다. (로그인 필요)
            </div>
          </button>

          <button
            onClick={goBrowse}
            className="w-full rounded-xl border bg-white p-6 text-left hover:shadow-md transition"
          >
            <div className="text-xl font-semibold">모집글 찾아서 신청</div>
            <div className="mt-1 text-slate-500 text-sm">
              이미 올라온 모집글을 보고 신청합니다. (비로그인 열람 가능)
            </div>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
