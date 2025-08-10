import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
    return null;
  }
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <img
        src={user.image.url}
        alt={user.image.alt}
        className="w-24 h-24 rounded-full mx-auto"
      />
      <h2 className="mt-4 text-center text-2xl font-semibold dark:text-white">
        {user.name.first} {user.name.middle} {user.name.last}
      </h2>
      <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
        {user.email}
      </p>
      <div className="mt-4 flex justify-center">
        <Button color="failure" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
