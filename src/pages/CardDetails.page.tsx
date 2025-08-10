import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "flowbite-react";


export default function CardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    axios
      .get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        { headers: { "x-auth-token": token } }
      )
      .then((res) => setCard(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!card) return <p className="text-center mt-10 dark:text-white">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg">
      <Button onClick={() => navigate(-1)} color="gray" outline className="mb-4">
        Back
      </Button>
      <h1 className="text-3xl font-bold dark:text-white mb-4">{card.title}</h1>
      <img
        src={card.image?.url}
        alt={card.image?.alt}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="dark:text-gray-300 mb-4">{card.subtitle}</p>
      <p className="dark:text-gray-300 mb-4">{card.description}</p>
      <div className="space-y-2 dark:text-gray-300">
        <p>
          <span className="font-semibold">Phone:</span> {card.phone}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {card.email}
        </p>
        <p>
          <span className="font-semibold">Website:</span>{" "}
          <a href={card.web} target="_blank" className="text-blue-500">
            {card.web}
          </a>
        </p>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {card.address.city}, {card.address.street} {card.address.houseNumber},{" "}
          {card.address.state}, {card.address.country} {card.address.zip}
        </p>
      </div>
    </div>
  );
}
