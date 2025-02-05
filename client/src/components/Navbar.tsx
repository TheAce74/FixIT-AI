import type React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          FixIT AI
        </Link>
        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/symptoms" className="text-white hover:text-gray-200">
                Symptoms
              </Link>
              {/* <Link
                to="/troubleshoot"
                className="text-white hover:text-gray-200"
              >
                Troubleshoot
              </Link> */}
              <Link
                to="/error-lookup"
                className="text-white hover:text-gray-200"
              >
                Error Lookup
              </Link>
              <Link to="/solutions" className="text-white hover:text-gray-200">
                Solutions
              </Link>
              <button
                onClick={logout}
                className="text-white hover:text-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
