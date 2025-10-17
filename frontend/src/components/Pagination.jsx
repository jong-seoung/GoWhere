export default function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;
    const prev = () => page > 0 && onPage(page - 1);
    const next = () => page + 1 < totalPages && onPage(page + 1);
    return (
      <div className="flex items-center gap-2 justify-center mt-4">
        <button onClick={prev} className="px-3 py-1 border rounded" disabled={page===0}>이전</button>
        <span className="text-sm">{page + 1} / {totalPages}</span>
        <button onClick={next} className="px-3 py-1 border rounded" disabled={page+1>=totalPages}>다음</button>
      </div>
    );
  }
  