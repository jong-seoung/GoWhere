import MainLayout from "../components/layout/MainLayout";
import PostList from "../components/PostList"; 

const Home = () => {

  return (
    <MainLayout>
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
