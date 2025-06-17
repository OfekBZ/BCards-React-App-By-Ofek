import { Navbar, DarkThemeToggle, FloatingLabel } from "flowbite-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../store/userSlice";


export default function MyNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.user);
  const [pathname, setPathname] = useState("/");
   const searchTerm = searchParams.get("search") || "";

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);


  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v) {
      setSearchParams({ search: v });
    } else {
      setSearchParams({});
    }
    if (pathname !== "/") {
      navigate("/");
    }
  };







  const getLinkClass = (to: string) => {
    const isActive = pathname === to;
    return `px-3 py-2 rounded-md text-lg transition ${
      isActive
        ? "text-blue-500 dark:text-white bg-blue-100 dark:bg-white/10"
        : "text-black dark:text-gray-300 hover:text-blue-500 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10"
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <header>
      <Navbar fluid rounded className="bg-sky-100 shadow-xl dark:bg-sky-700">
        <Navbar.Brand href="/">
          <span className="text-xl font-semibold dark:text-white">
            BCards By Ofek
          </span>
        </Navbar.Brand>

        {/* Search field outside of the Brand link */}
        <div className="flex-1 px-4">
          <FloatingLabel
            variant="standard"
            label="Search"
            value={searchTerm}
            onChange={onSearchChange}
            className="w-50 bg-transparent"
          />
        </div>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Link className={getLinkClass("/")} to="/">
            Home
          </Link>
          <Link className={getLinkClass("/about")} to="/about">
            About
          </Link>

          {user ? (
            <>
              <Link className={getLinkClass("/my-cards")} to="/my-cards">
                My Cards
              </Link>
              <Link className={getLinkClass("/favorites")} to="/favorites">
                Favorites
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-red-600 rounded-md hover:text-red-800"
              >
                Logout
              </button>
              <Link to="/profile">
              <img
                src={user.image?.url || "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"}
                alt={user.image?.alt || "User"}
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
              />
            </Link>
            </>
          ) : (
            <>
              <Link className={getLinkClass("/register")} to="/register">
                Register
              </Link>
              <Link className={getLinkClass("/login")} to="/login">
                Sign Up
              </Link>
            </>
          )}

          <DarkThemeToggle />
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}