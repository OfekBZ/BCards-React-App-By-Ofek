import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import MyNavbar from "./components/MyNavbar";
import MyFooter from "./components/MyFooter";
import FloatingAddButton from "./components/FloatingAddButton";
import BusinessRoute from "./components/BusinessRoute";

import HomePage from "./pages/Home.page";
import CardDetailsPage from "./pages/CardDetails.page";
import ProfilePage from "./pages/Profile.page";
import MyCardsPage from "./pages/MyCards.page";
import FavoritesPage from "./pages/Favorites.page";
import CreateCardPage from "./pages/CreateCard.page";
import EditCardPage from "./pages/EditCard.page";
import AboutPage from "./pages/About.page";
import RegisterPage from "./pages/Register.page";
import LoginPage from "./pages/Login.page";
import ErrorPage from "./pages/Error.page";

import { RootState } from "./store/store";
import { setUser, clearUser } from "./store/userSlice";

export default function App() {
  const user = useSelector((s: RootState) => s.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(clearUser());
      return;
    }
    let decoded: { _id: string };
    try {
      decoded = jwtDecode(token) as { _id: string };
    } catch {
      dispatch(clearUser());
      return;
    }
    axios
      .get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${decoded._id}`,
        { headers: { "x-auth-token": token } }
      )
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => dispatch(clearUser()));
  }, [dispatch]);

  return (
    <>
      <MyNavbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/card/:id" element={<CardDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-cards" element={<MyCardsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        <Route
          path="/create-card"
          element={
            <BusinessRoute>
              <CreateCardPage />
            </BusinessRoute>
          }
        />
        <Route
          path="/edit-card/:id"
          element={
            <BusinessRoute>
              <EditCardPage />
            </BusinessRoute>
          }
        />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>

      {user && user.isBusiness && <FloatingAddButton />}
      <MyFooter />
    </>
  );
}
