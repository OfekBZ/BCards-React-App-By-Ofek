import { useEffect, useState } from "react";
import { Card, Button } from "flowbite-react";
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
    houseNumber: string;
    zip: string;
  };
  image: {
    url: string;
    alt: string;
  };
};

export default function FavoritesPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards")
      .then((res) => {
        const favCards = res.data.filter((card: CardType) =>
          favorites.includes(card._id)
        );
        setCards(favCards);
      })
      .catch((err) => console.error("Failed to fetch favorites", err));
  }, [favorites]);

  const removeFromFavorites = (id: string) => {
    const updated = favorites.filter((favId) => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">❤️ Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
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
    </div>
  );
}
