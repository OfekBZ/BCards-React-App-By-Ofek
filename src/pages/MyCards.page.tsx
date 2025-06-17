// pages/MyCards.page.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem, { CardType } from "../components/CardItem";
import { jwtDecode } from "jwt-decode";

export default function MyCardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<{ _id: string }>(token);
      setUserId(decoded._id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios
      .get<CardType[]>(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
      )
      .then((res) => setCards(res.data.filter((c) => c.user_id === userId)))
      .catch((err) => console.error(err));
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        { headers: { "x-auth-token": token! } },
      );
      setCards((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
      {cards.length === 0 ? (
        <p className="text-center text-lg text-gray-600 dark:text-white">
          You haven't created any cards yet.
        </p>
      ) : (
        <div className="container mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <CardItem key={card._id} card={card} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
