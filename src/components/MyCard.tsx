import { useEffect, useState } from "react";
import { Spinner, Button } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type CardType = {
  _id: string;
  title: string;
  description: string;
  image?: { url?: string; alt?: string };
  phone?: string;
  address?: { street?: string; houseNumber?: string | number; city?: string };
  user_id?: string;
  ownerId?: string;
};

export default function MyCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const { data } = await axios.get<CardType[]>(
          "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
          { headers: { "x-auth-token": token } }
        );
        const uid = user?._id;
        const mine = data.filter(c => (c.user_id || c.ownerId) === uid);
        setCards(mine);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this card?")) return;
    const token = localStorage.getItem("token") || "";
    await axios.delete(
      `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
      { headers: { "x-auth-token": token } }
    );
    setCards(prev => prev.filter(c => c._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold dark:text-white">My Cards</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">No cards yet.</p>
        <Button className="mt-6" onClick={() => navigate("/cards/new")}>Create one</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {cards.map(card => (
        <div
          key={card._id}
          className="w-64 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mx-auto flex flex-col"
        >
          <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={card.image?.url || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={card.image?.alt || card.title}
              className="w-full h-full object-cover"
              onError={e => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=No+Image")}
            />
          </div>

          <div className="flex-1 p-3 flex flex-col">
            <h5 className="text-lg font-semibold dark:text-white line-clamp-1">{card.title}</h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{card.description}</p>
            <div className="mt-3 text-xs space-y-1 dark:text-gray-200">
              {card.phone ? <p>📞 {card.phone}</p> : null}
              {card.address ? (
                <p>
                  🏠 {card.address.street} {card.address.houseNumber}, {card.address.city}
                </p>
              ) : null}
            </div>

            <div className="mt-auto pt-4 flex items-center justify-center gap-2">
              <Button size="sm" color="blue" onClick={() => navigate(`/cards/${card._id}`)}>View</Button>
              <Button size="sm" color="warning" onClick={() => navigate(`/cards/edit/${card._id}`)}>Edit</Button>
              <Button size="sm" color="failure" onClick={() => handleDelete(card._id)}>Delete</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
