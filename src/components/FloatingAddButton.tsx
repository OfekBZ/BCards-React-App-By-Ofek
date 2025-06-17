import { Link } from "react-router-dom";
import { HiPlus } from "react-icons/hi";

export default function FloatingAddButton() {
  return (
    <Link
      to="/create-card"
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg text-3xl"
    >
      <HiPlus />
    </Link>
  );
}
