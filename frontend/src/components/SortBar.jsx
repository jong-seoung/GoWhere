export default function SortBar({ sort, dir, onChange }) {
    return (
      <div className="flex items-center gap-2">
        <select value={sort} onChange={(e)=>onChange({ sort: e.target.value })} className="border rounded px-2 py-2">
          <option value="createdAt">최신순</option>
          <option value="likeCount">좋아요순</option>
          <option value="viewCount">조회수순</option>
          <option value="ratingAvg">평점순</option>
          <option value="title">제목순</option>
        </select>
        <select value={dir} onChange={(e)=>onChange({ dir: e.target.value })} className="border rounded px-2 py-2">
          <option value="desc">내림차순</option>
          <option value="asc">오름차순</option>
        </select>
      </div>
    );
  }
  