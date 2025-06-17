import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import CardItem from "../components/CardItem";
import { jwtDecode } from "jwt-decode";

type CardType = {
  _id: string;
  title: string;
  subtitle: string;
  phone: string;
  email?: string;
  web?: string;
  image: { url: string; alt: string };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
  user_id: string;
};

export default function MyCardsPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    const decoded = jwtDecode<{ _id: string }>(token);
    setUserId(decoded._id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get<CardType[]>(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        { headers: { "x-auth-token": localStorage.getItem("token") || "" } }
      )
      .then((res) => {
        setCards(res.data.filter((c) => c.user_id === userId));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {cards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg dark:text-white">
          You haven't created any cards yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <CardItem
              key={card._id}
              card={card}
              showEditDelete
            />
          ))}
        </div>
      )}
    </div>
  );
}
