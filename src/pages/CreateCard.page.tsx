import { useState } from "react";
import { FloatingLabel, Button } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCardPage() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    image: { url: "", alt: "" },
    address: {
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: ""
    },
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: parsedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token Found");
      const response = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards",
        formData,
        {
          headers: {
            "x-auth-token":token,
          },
        }
      );

      alert("✅ Card created successfully!");
      navigate("/my-cards");
    } catch (error) {
      console.error("Card creation failed:", error);
      alert("❌ Failed to create card");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">Create a New Card</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabel type="text" label="Title" name="title" value={formData.title} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Description" name="description" value={formData.description} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Phone" name="phone" value={formData.phone} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="email" label="Email" name="email" value={formData.email} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Website" name="web" value={formData.web} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Image URL" name="image.url" value={formData.image.url} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Image Alt" name="image.alt" value={formData.image.alt} onChange={handleChange} variant="outlined" theme={{}} />

        <FloatingLabel type="text" label="State" name="address.state" value={formData.address.state} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Country" name="address.country" value={formData.address.country} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="City" name="address.city" value={formData.address.city} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="text" label="Street" name="address.street" value={formData.address.street} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="number" label="House Number" name="address.houseNumber" value={formData.address.houseNumber} onChange={handleChange} variant="outlined" theme={{}} />
        <FloatingLabel type="number" label="Zip Code" name="address.zip" value={formData.address.zip} onChange={handleChange} variant="outlined" theme={{}} />

        <div className="col-span-2 mt-4">
          <Button type="submit" color="blue" className="w-full">Create Card</Button>
        </div>
      </form>
    </div>
  );
}
