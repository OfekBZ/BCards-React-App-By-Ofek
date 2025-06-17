import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FloatingLabel, Button } from "flowbite-react";
import axios from "axios";

type FormData = {
  title: string;
  subtitle: string;
  phone: string;
  email: string;
  web: string;
  image: { url: string; alt: string };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
};

export default function EditCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
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
      zip: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!id || !token) return;

    axios
      .get(`https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`, {
        headers: { "x-auth-token": token },
      })
      .then((res) => {
        const c = res.data;
        setFormData({
          title: c.title,
          subtitle: c.subtitle,
          phone: c.phone,
          email: c.email,
          web: c.web,
          image: { url: c.image.url, alt: c.image.alt },
          address: {
            state: c.address.state,
            country: c.address.country,
            city: c.address.city,
            street: c.address.street,
            houseNumber: c.address.houseNumber,
            zip: c.address.zip,
          },
        });
      })
      .catch((err) => console.error("Failed to load card:", err));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!id || !token) return;

    try {
      await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        formData,
        { headers: { "x-auth-token": token } }
      );
      alert("✅ Card updated successfully!");
      navigate("/my-cards");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update card");
    }
  };

  const inputClass = "bg-transparent dark:bg-transparent";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        Edit Card
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <FloatingLabel
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="number"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Website"
          name="web"
          value={formData.web}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Image URL"
          name="image.url"
          value={formData.image.url}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Image Alt"
          name="image.alt"
          value={formData.image.alt}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />

        <FloatingLabel
          label="State"
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Country"
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="City"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Street"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
          type="text"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="House Number"
          name="address.houseNumber"
          value={formData.address.houseNumber}
          onChange={handleChange}
          type="number"
          className={inputClass}
          variant="outlined"
        />
        <FloatingLabel
          label="Zip Code"
          name="address.zip"
          value={formData.address.zip}
          onChange={handleChange}
          type="number"
          className={inputClass}
          variant="outlined"
        />

        <div className="col-span-2 mt-4">
          <Button color="blue" type="submit" className="w-full">
            Update Card
          </Button>
        </div>
      </form>
    </div>
  );
}
