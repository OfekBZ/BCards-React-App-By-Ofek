import { useEffect, useState } from "react";
import { TextInput, Spinner } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type CardType = {
  _id: string;
  title: string;
  description: string;
  image: { url: string; alt: string };
  phone: string;
  address: { street: string; houseNumber: string; city: string };
  ownerId: string;
  user_id?:string;
};

export default function HomePage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem("favorites");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<CardType[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setCards(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      window.dispatchEvent(new Event("favorites:changed"));
      return updated;
    });
  };

  const filtered = cards.filter(card => {
    const term = search.trim().toLowerCase();
    return (
      card.title.toLowerCase().includes(term) ||
      card.description.toLowerCase().includes(term) ||
      card.address.city.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <TextInput
        placeholder="Search cards..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(card => (
          <div
            key={card._id}
            className="w-72 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mx-auto flex flex-col cursor-pointer"
            onClick={() => navigate(`/cards/${card._id}`)}
          >
            <div className="h-40 w-full relative">
              <img
                src={card.image.url}
                alt={card.image.alt}
                className="w-full h-full object-cover"
              />
              <button
                aria-label={isFavorite(card._id) ? "Remove from favorites" : "Add to favorites"}
                onClick={(e) => toggleFavorite(e, card._id)}
                className="absolute top-2 right-2 rounded-full p-2 bg-white/90 dark:bg-gray-800/90 shadow"
              >
                {isFavorite(card._id) ? (
                  <AiFillHeart className="w-6 h-6 text-red-500" />
                ) : (
                  <AiOutlineHeart className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                )}
              </button>
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
                  🏠 {card.address.street} {card.address.houseNumber}, {card.address.city}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
