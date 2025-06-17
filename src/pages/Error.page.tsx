import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold">404: Page Not Found</h1>
        <h2 className="text-xl">😕</h2>
        <p>Sorry, the page you are looking for is not available</p>
        <Button onClick={goHome}>Go Home</Button>
        <Link to="/about" className="text-blue-500 underline">
          About
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
