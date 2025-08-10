import { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      setError(e.message || "Invalid email or password");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-6 text-center text-xl font-semibold dark:text-white">Log In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => setData((p) => ({ ...p, password: e.target.value }))}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="mt-6 flex justify-between gap-4">
          <Button color="gray" type="button" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button onClick={()=> navigate("/register")} >Register</Button>
          <Button color="blue" type="submit">
            Login
          </Button>
        </div>
      </form>
      
    </div>
  );
}
