import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold dark:text-white">404 — Page not found</h1>
      <br />
      <h2 className="text-xl">😕</h2>
      <p className="text-2xl mt-2 text-gray-600 dark:text-gray-400">The page you are looking for is not exist.</p>
      <Button className="mt-6" onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );
}
