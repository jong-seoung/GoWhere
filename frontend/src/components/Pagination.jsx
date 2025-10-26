// src/components/Pagination.jsx
export default function Pagination({ page, totalPages, onPage, className = "" }) {
  if (totalPages <= 1) return null;
  const prev = () => page > 0 && onPage(page - 1);
  const next = () => page + 1 < totalPages && onPage(page + 1);
  return (
    <div className={`flex items-center gap-2 justify-center ${className}`}>
      <button
        onClick={prev}
        className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:shadow disabled:opacity-40"
        disabled={page===0}
      >
        이전
      </button>
      <span className="text-sm text-gray-600">{page + 1} / {totalPages}</span>
      <button
        onClick={next}
        className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:shadow disabled:opacity-40"
        disabled={page+1>=totalPages}
      >
        다음
      </button>
    </div>
  );
}
