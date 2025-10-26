// src/components/PostCard.jsx
export default function PostCard({ p }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      {p.thumbnailUrl && (
        <img src={p.thumbnailUrl} alt={p.title} className="w-full h-44 object-cover" />
      )}
      <div className="p-4">
        <h2 className="font-semibold text-lg line-clamp-1">{p.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.content}</p>

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="px-2 py-1 rounded bg-gray-100">{p.region || "지역 미정"}</span>
          {Array.isArray(p.tags) && p.tags.slice(0,3).map((t,i)=>(
            <span key={i} className="px-2 py-1 rounded bg-blue-50 text-blue-700">{t}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
          <div>❤️ {p.likeCount} · 👁 {p.viewCount} · ⭐ {p.ratingAvg}</div>
          <time className="text-xs">{new Date(p.createdAt).toLocaleDateString()}</time>
        </div>
      </div>
    </div>
  );
}
