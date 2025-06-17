import {
  Navbar,
  DarkThemeToggle,
  FloatingLabel,
} from "flowbite-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../store/userSlice";

export default function MyNavbar() {
  const user = useSelector((s: RootState) => s.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
  };

  const getLinkClass = (to: string) => {
    const isActive = pathname === to;
    return `relative text-lg px-3 py-2 rounded-md transition ${
      isActive
        ? "text-blue-500 dark:text-white z-10 before:content-[''] before:absolute before:inset-0 before:rounded-md before:bg-blue-100 dark:before:bg-white/10 before:blur before:opacity-70 before:z-[-1]"
        : "text-black dark:text-gray-300 hover:text-blue-500 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10"
    }`;
  };

  return (
    <header>
      <Navbar fluid rounded className="bg-sky-100 shadow-xl dark:bg-sky-700">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            BCards By Ofek
          </span>
          <FloatingLabel
            variant="outlined"
            label="Search"
            name="search"
            type="text"
            className="ml-7 bg-transparent dark:bg-transparent"
            onChange={() => {}}
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="transition-all duration-500 ease-in-out">
          <Link className={getLinkClass("/")} to="/">
            Home
          </Link>
          <Link className={getLinkClass("/about")} to="/about">
            About
          </Link>

          {!user && (
            <>
              <Link
                className={getLinkClass("/register")}
                to="/register"
              >
                Register
              </Link>
              <Link
                className={getLinkClass("/login")}
                to="/login"
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <>
              {user.isBusiness && (
                <Link
                  className={getLinkClass("/my-cards")}
                  to="/my-cards"
                >
                  My Cards
                </Link>
              )}
              <Link
                className={getLinkClass("/favorites")}
                to="/favorites"
              >
                Favorites
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 px-3 py-2 rounded-md"
              >
                Logout
              </button>
              <Link to="/profile">
                <img
                  src={
                    user.image?.url ||
                    "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
                  }
                  alt={user.image?.alt || "User"}
                  className="w-8 h-8 rounded-full border-2 border-white ml-2 object-cover"
                />
              </Link>
            </>
          )}

          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
