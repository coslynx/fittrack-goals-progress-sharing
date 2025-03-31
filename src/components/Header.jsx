```jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface HeaderProps {
  // No props needed for this component
}

const Header: React.FC<HeaderProps> = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto py-4 px-5 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Fitness Tracker</Link>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mr-4 hover:text-blue-200">Dashboard</Link>
              <Link to="/goals" className="mr-4 hover:text-blue-200">Goals</Link>
              <button
                onClick={() => {
                  logout().catch(error => console.error("Logout failed:", error));
                }}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Logout
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
```