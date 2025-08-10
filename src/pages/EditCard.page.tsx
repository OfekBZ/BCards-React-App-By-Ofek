// src/pages/EditCard.page.tsx
import { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea, Spinner, Alert } from "flowbite-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type FormData = {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  imageUrl: string;
  imageAlt: string;
  state: string;
  country: string;
  city: string;
  street: string;
  houseNumber: string;
  zip: string;
};

type CardType = {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  phone: string;
  email: string;
  web?: string;
  image?: { url?: string; alt?: string };
  address?: {
    state?: string;
    country?: string;
    city?: string;
    street?: string;
    houseNumber?: string | number;
    zip?: string | number;
  };
  ownerId?: string;
  user_id?: string;
};

export default function EditCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState<FormData>({
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    imageUrl: "",
    imageAlt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await axios.get<CardType>(
          `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
          { headers: { "x-auth-token": localStorage.getItem("token") || "" } }
        );

        const owner = data.ownerId || data.user_id;
        const canEdit = !!user && (user.isAdmin || user._id === owner);
        if (!canEdit) {
          navigate("/");
          return;
        }

        setForm({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          phone: data.phone || "",
          email: data.email || "",
          web: data.web || "",
          imageUrl: data.image?.url || "",
          imageAlt: data.image?.alt || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          city: data.address?.city || "",
          street: data.address?.street || "",
          houseNumber:
            data.address?.houseNumber !== undefined ? String(data.address.houseNumber) : "",
          zip: data.address?.zip !== undefined ? String(data.address.zip) : "",
        });
      } catch (e: any) {
        setServerError(
          typeof e?.response?.data === "string"
            ? e.response.data
            : e?.response?.data?.message || "Failed to load card"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, navigate]);

  const onChange =
    (name: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [name]: e.target.value }));
      setErrors((p) => ({ ...p, [name]: "" }));
      setServerError("");
    };

  const isHttpUrl = (s: string) => /^https?:\/\//i.test(s.trim());

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.subtitle.trim()) e.subtitle = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!/^[0-9+\-\s()]{9,20}$/.test(form.phone.trim())) e.phone = "Phone invalid";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email.trim())) e.email = "Email invalid";
    if (!form.imageUrl.trim() || !isHttpUrl(form.imageUrl)) e.imageUrl = "Valid URL required (http/https)";
    if (!form.imageAlt.trim()) e.imageAlt = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.street.trim()) e.street = "Required";
    const hn = String(form.houseNumber ?? "").trim();
    if (!hn || !/^\d+$/.test(hn)) e.houseNumber = "Numbers only";
    const z = String(form.zip ?? "").trim();
    if (!z || !/^\d+$/.test(z)) e.zip = "Numbers only";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!validate() || !id) return;

    const payload: any = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      phone: form.phone.trim(),
      email: form.email.trim().toLowerCase(),
      image: { url: form.imageUrl.trim(), alt: form.imageAlt.trim() },
      address: {
        state: form.state.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        street: form.street.trim(),
        houseNumber: Number(String(form.houseNumber).trim()),
        zip: Number(String(form.zip).trim()),
      },
    };
    if (form.web.trim())
      payload.web = isHttpUrl(form.web) ? form.web.trim() : `https://${form.web.trim()}`;

    try {
      const token = localStorage.getItem("token") || "";
      await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${id}`,
        payload,
        { headers: { "x-auth-token": token } }
      );
      navigate(`/cards/${id}`);
    } catch (err: any) {
      const raw = err?.response?.data;
      const msg =
        typeof raw === "string" ? raw : raw?.message || raw?.error || "Update failed";
      setServerError(msg);
      console.error("Update card error:", raw || err.message, { payload });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-5"
    >
      <h2 className="text-2xl font-semibold dark:text-white">Edit Card</h2>

      {serverError && (
        <Alert color="failure">
          <span className="font-medium">Error:</span> {serverError}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title" value="Title" />
          <TextInput id="title" value={form.title} onChange={onChange("title")} required />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="subtitle" value="Subtitle" />
          <TextInput id="subtitle" value={form.subtitle} onChange={onChange("subtitle")} required />
          {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description" value="Description" />
        <Textarea id="description" rows={4} value={form.description} onChange={onChange("description")} required />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="phone" value="Phone" />
          <TextInput id="phone" value={form.phone} onChange={onChange("phone")} required />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput id="email" type="email" value={form.email} onChange={onChange("email")} required />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="web" value="Website (optional)" />
          <TextInput id="web" value={form.web} onChange={onChange("web")} placeholder="https://..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="imageUrl" value="Image URL" />
          <TextInput id="imageUrl" value={form.imageUrl} onChange={onChange("imageUrl")} required />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>
        <div>
          <Label htmlFor="imageAlt" value="Image Alt" />
          <TextInput id="imageAlt" value={form.imageAlt} onChange={onChange("imageAlt")} required />
          {errors.imageAlt && <p className="text-red-500 text-sm mt-1">{errors.imageAlt}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="country" value="Country" />
          <TextInput id="country" value={form.country} onChange={onChange("country")} required />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
        <div>
          <Label htmlFor="state" value="State" />
          <TextInput id="state" value={form.state} onChange={onChange("state")} />
        </div>
        <div>
          <Label htmlFor="city" value="City" />
          <TextInput id="city" value={form.city} onChange={onChange("city")} required />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="street" value="Street" />
          <TextInput id="street" value={form.street} onChange={onChange("street")} required />
          {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
        </div>
        <div>
          <Label htmlFor="houseNumber" value="House Number" />
          <TextInput
            id="houseNumber"
            value={form.houseNumber}
            onChange={onChange("houseNumber")}
            inputMode="numeric"
            required
          />
          {errors.houseNumber && <p className="text-red-500 text-sm mt-1">{errors.houseNumber}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="zip" value="ZIP" />
          <TextInput id="zip" value={form.zip} onChange={onChange("zip")} inputMode="numeric" required />
          {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
        </div>
      </div>

      <Button type="submit" color="yellow" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}
