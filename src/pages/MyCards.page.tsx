import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type CardType = {
  _id: string;
  title: string;
  description: string;
  image: { url: string; alt: string };
  phone: string;
  address: { street: string; houseNumber: string; city: string };
  ownerId: string;
};

export default function MyCardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await axios.get<CardType[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setCards(res.data.filter(c => c.ownerId === user._id));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-600 dark:text-gray-400">Please log in to see your cards.</p>;
  }

  if (cards.length === 0) {
    return <p className="text-center mt-10 text-gray-600 dark:text-gray-400">You haven't created any cards yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {cards.map(card => (
        <Link
          key={card._id}
          to={`/cards/${card._id}`}
          className="w-72 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mx-auto flex flex-col cursor-pointer"
        >
          <div className="h-40 w-full">
            <img
              src={card.image.url}
              alt={card.image.alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                {card.title}
              </h5>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                {card.description}
              </p>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>📞 {card.phone}</p>
              <p>
                🏠 {card.address.street} {card.address.houseNumber},{" "}
                {card.address.city}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
