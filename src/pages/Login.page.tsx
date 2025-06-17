import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FloatingLabel } from "flowbite-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../store/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Login() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("login Clicked");

    try {
      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        {
          email: loginData.email,
          password: loginData.password,
        },
      );

      const token = response.data;
      localStorage.setItem("token", token);

      const decoded: UserType = jwtDecode(token);
      console.log("Decoded user:", decoded);

      const userDetails = await axios.get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${decoded._id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );

      dispatch(setUser(userDetails.data));
      alert("✅ Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("login failed", error);
      alert("❌ Email or password incorrect.");
    }
  };

  const inputClass = "bg-transparent dark:bg-transparent";

  return (
    <>
      <div className="mx-auto mt-10 max-w-md">
        <h1 className="mb-6 text-center text-xl font-semibold dark:text-white">
          Log In{" "}
        </h1>
        <form
          onSubmit={handleLogin}
          className="mx-auto mt-10 max-w-md space-y-4"
        >
          <FloatingLabel
            className={inputClass}
            variant="outlined"
            label="Email"
            name="email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          <FloatingLabel
            className={inputClass}
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <div className="mt-6 flex justify-between gap-4">
            <Button color="gray" type="button" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button color="blue" type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
