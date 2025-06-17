import { Card } from "flowbite-react";
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export type CardType = {
  _id: string;
  title: string;
  subtitle: string;
  phone: string;
  address: {
    city: string;
    street: string;
    houseNumber: string;
  };
  image: {
    url: string;
    alt: string;
  };
};

export default function CardItem({
  card,
  onDelete,
}: {
  card: CardType;
  onDelete?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = () => {
    const updated = favorites.includes(card._id)
      ? favorites.filter((id) => id !== card._id)
      : [...favorites, card._id];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isMyCards = Boolean(onDelete);

  return (
    <Card
      imgAlt={card.image.alt}
      imgSrc={card.image.url}
      className="relative"
    >
      <div className="absolute top-2 right-2 flex space-x-2">
        {isMyCards ? (
          <>
            <span
              onClick={() => onDelete!(card._id)}
              className="cursor-pointer text-gray-500 hover:text-red-600 text-xl"
            >
              <FaTrash />
            </span>
            <span
              onClick={() => navigate(`/edit-card/${card._id}`)}
              className="cursor-pointer text-blue-500 hover:text-blue-700 text-xl"
            >
              <FaEdit />
            </span>
          </>
        ) : (
          user && (
            <span
              onClick={toggleFavorite}
              className="cursor-pointer text-red-500 hover:text-red-700 text-xl"
            >
              {favorites.includes(card._id) ? <FaHeart /> : <FaRegHeart />}
            </span>
          )
        )}
      </div>

      <h5 className="text-xl font-bold dark:text-white">{card.title}</h5>
      <p className="dark:text-gray-400">{card.subtitle}</p>
      <p className="dark:text-gray-400">{card.phone}</p>
      <p className="dark:text-gray-400">
        {card.address.city}, {card.address.street} {card.address.houseNumber}
      </p>
    </Card>
  );
}
