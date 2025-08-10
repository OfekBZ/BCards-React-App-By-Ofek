import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "flowbite-react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

type CardType = {
  _id: string;
  title: string;
  subtitle: string;
  phone: string;
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string | number;
    zip: string | number;
  };
  image: {
    url: string;
    alt: string;
  };
};

export default function FavoritesPage() {
  const [allCards, setAllCards] = useState<CardType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const readFavorites = () => {
    try {
      const s = localStorage.getItem("favorites");
      setFavorites(s ? JSON.parse(s) : []);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    readFavorites();
    const onFavChange = () => readFavorites();
    window.addEventListener("favorites:changed", onFavChange);
    window.addEventListener("storage", onFavChange);
    return () => {
      window.removeEventListener("favorites:changed", onFavChange);
      window.removeEventListener("storage", onFavChange);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<CardType[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
        );
        setAllCards(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const favCards = allCards.filter((c) => favorites.includes(c._id));

  const removeFromFavorites = (id: string) => {
    const updated = favorites.filter((x) => x !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event("favorites:changed"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">❤️ Favorites</h1>
      {favCards.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favCards.map((card) => (
            <Card
              key={card._id}
              imgAlt={card.image?.alt || "Image"}
              imgSrc={card.image?.url || "https://via.placeholder.com/300x200?text=No+Image"}
              className="relative"
            >
              <div className="absolute top-2 right-2 text-red-500 text-xl">
                <FaHeart />
              </div>
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                {card.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">{card.subtitle}</p>
              <p className="font-normal text-gray-700 dark:text-gray-400">{card.phone}</p>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {card.address.city}, {card.address.street} {card.address.houseNumber}
              </p>
              <Button
                color="failure"
                className="mt-4"
                onClick={() => removeFromFavorites(card._id)}
              >
                Remove from Favorites
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
