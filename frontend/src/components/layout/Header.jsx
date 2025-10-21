import { FiLogOut, FiUser, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = ({ onLogout, handleProfilePage }) => {
  return (
    <header className="border-divider fixed top-0 w-full z-40 bg-white h-16">
      <div className="card-header">
        <h1 className="text-3xl text-brand ml-20">
          <Link to="/" className="hover:text-brand/80 transition">
            GoWhere
          </Link>
        </h1>
        <div className="flex items-center space-x-4 mr-20">
          {onLogout && (
            <>
              <button
                onClick={handleProfilePage}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition"
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
