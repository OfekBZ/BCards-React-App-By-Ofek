// src/components/MyNavbar.tsx
import { useEffect, useState } from "react";
import { Navbar, DarkThemeToggle } from "flowbite-react";
import { Link, useLocation} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MyNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const getLinkClass = (to: string) => {
    const isActive = pathname === to;
    return `relative text-lg px-3 py-2 rounded-md transition ${
      isActive
        ? "text-blue-600 dark:text-white bg-blue-50 dark:bg-white/10"
        : "text-black dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10"
    }`;
  };

  return (
    <header>
      <Navbar fluid rounded className=" bg-gray-100 p-4 dark:bg-gray-800">
        <Navbar.Brand as={Link} to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            BCards By Ofek
          </span>
        </Navbar.Brand>

        <div className="flex items-center gap-3 md:order-2">
          <DarkThemeToggle />
          {!user ? (
            <Link to="/login" className="text-sm px-3 py-2 rounded-md bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200">
              Login
            </Link>
          ) : (
            <>
              <button
                onClick={logout}
                className="text-sm px-3 py-2 rounded-md bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                Logout
              </button>
              <Link to="/profile" className="ml-1">
                <img
                  src={user.image?.url || "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"}
                  alt={user.image?.alt || "User"}
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                />
              </Link>
            </>
          )}
          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Link className={getLinkClass("/")} to="/">
            Home
          </Link>
          <Link className={getLinkClass("/about")} to="/about">
            About
          </Link>
          <Link className={getLinkClass("/favorites")} to="/favorites">
            Favorites
          </Link>
          {(user?.isBusiness || user?.isAdmin) && (
            <Link className={getLinkClass("/my-cards")} to="/my-cards">
              My Cards
            </Link>
          )}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
