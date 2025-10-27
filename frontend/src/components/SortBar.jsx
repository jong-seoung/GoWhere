// src/components/SortBar.jsx
export default function SortBar({ sort, dir, onChange }) {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <select
        value={sort}
        onChange={(e)=>onChange({ sort: e.target.value })}
        className="bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
      >
        <option value="createdAt">최신순</option>
        <option value="likeCount">좋아요순</option>
        <option value="viewCount">조회수순</option>
        <option value="ratingAvg">평점순</option>
        <option value="title">제목순</option>
      </select>
      <select
        value={dir}
        onChange={(e)=>onChange({ dir: e.target.value })}
        className="bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
      >
        <option value="desc">내림차순</option>
        <option value="asc">오름차순</option>
      </select>
    </div>
  );
}
