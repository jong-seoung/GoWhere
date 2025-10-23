// src/components/common/ErrorBanner.jsx
export default function ErrorBanner({ message, className = "" }) {
    return (
      <div
        className={`rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 ${className}`}
      >
        <div className="font-semibold">문제가 발생했어요</div>
        <div className="text-sm mt-1">{message}</div>
      </div>
    );
  }
  