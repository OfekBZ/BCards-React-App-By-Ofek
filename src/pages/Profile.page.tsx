import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const {
    name: { first, middle, last },
    email,
    phone,
    image,
    address: { street, city, state, country, houseNumber, zip },
    isBusiness,
  } = user;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10">
      <div className="flex flex-col items-center">
        <img
          src={image?.url || "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"}
          alt={image?.alt || "User avatar"}
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
        />
        <h1 className="mt-4 text-2xl font-bold dark:text-white">
          {first} {middle} {last}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isBusiness ? "Business Account" : "Regular Account"}
        </p>
      </div>

      <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-200">
        <div>
          <span className="font-semibold">Email:</span> {email}
        </div>
        <div>
          <span className="font-semibold">Phone:</span> {phone}
        </div>
        <div>
          <span className="font-semibold">Address:</span>{" "}
          {street} {houseNumber}, {city}, {state} {zip}, {country}
        </div>
      </div>
    </div>
  );
}