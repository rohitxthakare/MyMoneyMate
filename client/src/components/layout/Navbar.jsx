import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfile, setIsProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    // Close the profile menu when clicking outside
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfile(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 text-gray-800 px-3 md:px-6 py-4 flex flex-wrap gap-3 justify-between items-center sticky top-0 shadow-sm z-50">
      <div className="flex items-center gap-2">
        <FaWallet className="text-blue-600" size={20} />

        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          MyMoneyMate
        </h1>
      </div>

      <ul className="flex flex-wrap items-center gap-3 md:gap-8">
        {user && (
          <li>
            <Link
              to="/dashboard"
              className="font-medium transition-colors duration-200 text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </li>
        )}

        {user && (
          <li>
            <Link
              to="/transactions"
              className="font-medium transition-colors duration-200 text-gray-700 hover:text-blue-600"
            >
              Transactions
            </Link>
          </li>
        )}

        {user && (
          <li>
            <Link
              to="/assistant"
              className="font-medium transition-colors duration-200 text-gray-700 hover:text-blue-600"
            >
              AI Assistant
            </Link>
          </li>
        )}

        {!user && (
          <li>
            <Link
              to="/login"
              className="hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
          </li>
        )}

        <li className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfile(true)}
            className="text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
            aria-label="Toggle profile menu"
            aria-expanded={isProfile}
          >
            <FiUser size={16} />
          </button>

          {isProfile && user && (
            <div className="absolute top-14 left-0 min-[365px]:left-auto min-[365px]:right-0 w-72 max-w-[50vw] bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200/50 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-green-500 px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-bold text-xl">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-lg text-white truncate">
                      {user?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl px-4 py-3 transition-colors flex items-center justify-center gap-2"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;