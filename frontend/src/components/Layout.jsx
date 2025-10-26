// src/components/Layout.jsx
import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="font-bold text-lg tracking-tight">
            GoWhere <span className="text-indigo-600">Buddy</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <NavLink
              to="/buddies"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md hover:bg-slate-100 ${
                  isActive ? "bg-slate-100 font-medium" : ""
                }`
              }
            >
              동행자 모집
            </NavLink>
            <NavLink
              to="/buddies/new"
              className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200"
            >
              글 작성
            </NavLink>
            <NavLink
              to="/buddies/my-applications"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md hover:bg-slate-100 ${
                  isActive ? "bg-slate-100 font-medium" : ""
                }`
              }
            >
              내 신청
            </NavLink>
            <NavLink
              to="/profile/1"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100"
            >
              프로필
            </NavLink>
          </div>
        </nav>
      </header>

      {/* Page */}
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t mt-10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GoWhere Buddy
      </footer>
    </div>
  );
}
