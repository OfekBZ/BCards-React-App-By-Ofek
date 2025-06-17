import { Card } from "flowbite-react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

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

export default function MyCard({
  card,
  onDelete,
}: {
  card: CardType;
  onDelete: (id: string) => void;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = () => {
    const updated = favorites.includes(card._id)
      ? favorites.filter((id) => id !== card._id)
      : [...favorites, card._id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <Card
      imgAlt={card.image.alt || "Image"}
      imgSrc={card.image.url || "https://via.placeholder.com/300x200?text=No+Image"}
      className="relative"
    >
      <div className="absolute top-2 right-2 flex space-x-2">
        <span
          onClick={() => onDelete(card._id)}
          className="cursor-pointer text-gray-500 hover:text-red-600 text-xl"
        >
          <FaTrash />
        </span>
        <span
          onClick={toggleFavorite}
          className="cursor-pointer text-red-500 text-xl"
        >
          {favorites.includes(card._id) ? <FaHeart /> : <FaRegHeart />}
        </span>
      </div>
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {card.title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {card.subtitle}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {card.phone}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {card.address.city}, {card.address.street} {card.address.houseNumber}
      </p>
    </Card>
  );
}
