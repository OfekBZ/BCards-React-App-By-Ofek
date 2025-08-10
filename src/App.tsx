import {  Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home.page";
import FavoritesPage from "./pages/Favorites.page";
import ProfilePage from "./pages/Profile.page";
import Register from "./pages/Register.page";
import LoginPage from "./pages/Login.page";
import CreateCard from "./pages/CreateCard.page";
import EditCard from "./pages/EditCard.page";
import CardDetail from "./pages/CardDetails.page";
import NotFoundPage from "./pages/NotFound.page";
import ProtectedRoute from "./components/ProtectedRoute";
import BusinessRoute from "./components/BusinessRoute";
import AddCardFab from "./components/FloatingAddButton";
import MyNavbar from "./components/MyNavbar";
import AboutPage from "./pages/About.page";
import MyCard from "./components/MyCard";

export default function App() {
  useAuth()
 

  return (
    <>
    <MyNavbar />
     
      <main className="min-h-screen bg-white p-4 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cards/:id" element={<CardDetail />} />
     
          <Route
            path="/my-cards"
            element={
              <ProtectedRoute>
                <MyCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cards/new"
            element={
              <BusinessRoute>
                <CreateCard />
              </BusinessRoute>
            }
          />
          <Route
            path="/cards/edit/:id"
            element={
              <ProtectedRoute>
                <EditCard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <AddCardFab />
      </main>
    </>
  );
}
