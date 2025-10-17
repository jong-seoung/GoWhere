export default function PostCard({ p }) {
    return (
      <div className="border rounded-md p-3 shadow-sm bg-white">
        {p.thumbnailUrl && <img src={p.thumbnailUrl} alt={p.title} className="w-full h-40 object-cover rounded" />}
        <h2 className="font-bold text-lg mt-2">{p.title}</h2>
        <div className="text-sm text-gray-600">{p.region || "-"}</div>
        {Array.isArray(p.tags) && p.tags.length > 0 && (
          <div className="text-xs mt-1 flex flex-wrap gap-1">
            {p.tags.map((t, i) => <span key={i} className="px-2 py-1 bg-gray-100 rounded">{t}</span>)}
          </div>
        )}
        <div className="text-sm mt-2">❤️ {p.likeCount} · 👁 {p.viewCount} · ⭐ {p.ratingAvg}</div>
        <div className="text-xs text-gray-500 mt-1">{new Date(p.createdAt).toLocaleString()}</div>
      </div>
    );
  }
  