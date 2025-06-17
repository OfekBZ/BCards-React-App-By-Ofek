// pages/Home.page.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem, { CardType } from "../components/CardItem";
import { Link, useSearchParams } from "react-router-dom";
import { Spinner } from "flowbite-react";


export default function HomePage() {
  const [cards, setCards] = useState<CardType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const term = (searchParams.get("search") || "").toLowerCase();

 useEffect(() => {
    setLoading(true);
    axios
      .get<CardType[]>(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
      )
      .then((res) => setCards(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


    const filtered = cards.filter((c) =>
    c.title.toLowerCase().includes(term) ||
    c.subtitle.toLowerCase().includes(term)
  );


   if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      {filtered.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-white text-lg">
          {term ? "No results found." : "No cards available."}
        </p>
      ) : (
        <div className="container mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((card) => (
            <Link key={card._id} to={`/card/${card._id}`}>
              <CardItem card={card} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}