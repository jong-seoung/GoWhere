// src/components/layout/Header.jsx
import { FiLogOut, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = ({ onLogout, handleProfilePage }) => {
  return (
    <header className="border-divider fixed top-0 w-full z-40 bg-white h-16">
      <div className="card-header">
        <h1 className="text-3xl text-brand">
          <Link to="/" className="hover:text-brand/80 transition">
            GoWhere
          </Link>
        </h1>
        <div className="flex items-center space-x-4">
          {/*/buddies 이동 버튼 */}
          <Link
            to="/buddies"
            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            + 동행자 모집 +{" "}
          </Link>

          {onLogout && (
            <>
              <button
                onClick={handleProfilePage}
                className="flex items-center space-x-2 text-gray-700 hover:text-brand transition"
              >
                <FiUser size={22} />
              </button>
              <button
                onClick={onLogout}
                className="text-gray-700 hover:text-red-500 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <FiLogOut size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
