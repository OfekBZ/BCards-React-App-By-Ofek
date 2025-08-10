import { Link, useLocation } from "react-router-dom";
import { HiPlus } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";

export default function AddCardFab() {
  const { user } = useAuth();
  const location = useLocation();

  const hideOn = ["/login", "/register", "/cards/new"];
  const canCreate = !!user && (user.isBusiness || user.isAdmin);

  if (!canCreate || hideOn.includes(location.pathname)) return null;

  return (
    <Link
      to="/cards/new"
      aria-label="Create card"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
    >
      <HiPlus className="w-7 h-7" />
    </Link>
  );
}