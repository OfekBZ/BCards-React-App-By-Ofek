import { useState } from "react";
import { FloatingLabel, ToggleSwitch, Button } from "flowbite-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type NamePart = "first" | "middle" | "last";
type ImageField = "url" | "alt";
type AddressField = "state" | "country" | "city" | "street" | "houseNumber" | "zip";

type FormDataType = {
  name: Record<NamePart, string>;
  image: Record<ImageField, string>;
  address: Record<AddressField, string>;
  isBusiness: boolean;
  email: string;
  password: string;
  phone: string;
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataType>({
    name: { first: "", middle: "", last: "" },
    image: { url: "", alt: "" },
    address: { state: "", country: "", city: "", street: "", houseNumber: "", zip: "" },
    isBusiness: false,
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // חשוב: כאן הסרנו את 'type' מה־destructuring
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    if (name.startsWith("name.")) {
      const child = name.split(".")[1] as NamePart;
      setFormData(prev => ({
        ...prev,
        name: { ...prev.name, [child]: value },
      }));
      setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }
    if (name.startsWith("image.")) {
      const field = name.split(".")[1] as ImageField;
      setFormData(prev => ({
        ...prev,
        image: { ...prev.image, [field]: value },
      }));
      setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }
    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as AddressField;
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
      setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }
    if (name === "isBusiness") {
      setFormData(prev => ({ ...prev, isBusiness: checked }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value } as FormDataType));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.first.trim()) newErrors["name.first"] = "First name is required";
    if (!formData.name.last.trim()) newErrors["name.last"] = "Last name is required";
    if (!formData.email.trim()) newErrors["email"] = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors["email"] = "Invalid email";
    if (!formData.password.trim()) newErrors["password"] = "Password is required";
    else if (formData.password.trim().length < 6) newErrors["password"] = "Password must be at least 6 characters";
    if (!formData.phone.trim()) newErrors["phone"] = "Phone is required";
    else if (!/^\d+$/.test(formData.phone.trim())) newErrors["phone"] = "Numbers only";
    if (!formData.address.country.trim()) newErrors["address.country"] = "Country is required";
    if (!formData.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!formData.address.street.trim()) newErrors["address.street"] = "Street is required";
    if (!formData.address.houseNumber.trim()) newErrors["address.houseNumber"] = "House # is required";
    else if (!/^\d+$/.test(formData.address.houseNumber.trim())) newErrors["address.houseNumber"] = "House # must be numeric";
    if (!formData.address.zip.trim()) newErrors["address.zip"] = "ZIP is required";
    else if (!/^\d+$/.test(formData.address.zip.trim())) newErrors["address.zip"] = "ZIP must be numeric";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
        {
          name: {
            first: formData.name.first.trim(),
            middle: formData.name.middle.trim(),
            last: formData.name.last.trim(),
          },
          image: {
            url: formData.image.url.trim(),
            alt: formData.image.alt.trim(),
          },
          address: {
            state: formData.address.state.trim(),
            country: formData.address.country.trim(),
            city: formData.address.city.trim(),
            street: formData.address.street.trim(),
            houseNumber: formData.address.houseNumber.trim(),
            zip: formData.address.zip.trim(),
          },
          isBusiness: formData.isBusiness,
          email: formData.email.trim(),
          password: formData.password.trim(),
          phone: formData.phone.trim(),
        }
      );
      navigate("/login");
    } catch {
      alert("Something went wrong during registration");
    }
  };

  const inputClass = "bg-transparent";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-7">
      <h1 className="text-3xl font-semibold dark:text-white">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">👤 Name</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["first", "middle", "last"] as NamePart[]).map(part => (
              <div key={part}>
                <FloatingLabel
                  variant="outlined"
                  label={`${part} name`}
                  name={`name.${part}`}
                  value={formData.name[part]}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors[`name.${part}`] && <p className="text-red-500 text-sm">{errors[`name.${part}`]}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">📩 Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FloatingLabel
                variant="outlined"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🖼️ Image Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["url", "alt"] as ImageField[]).map(field => (
              <div key={field}>
                <FloatingLabel
                  variant="outlined"
                  label={field}
                  name={`image.${field}`}
                  value={formData.image[field]}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors[`image.${field}`] && <p className="text-red-500 text-sm">{errors[`image.${field}`]}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🏠 Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              "state",
              "country",
              "city",
              "street",
              "houseNumber",
              "zip",
            ] as AddressField[]).map(field => (
              <div key={field}>
                <FloatingLabel
                  variant="outlined"
                  label={field}
                  name={`address.${field}`}
                  value={formData.address[field]}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors[`address.${field}`] && <p className="text-red-500 text-sm">{errors[`address.${field}`]}</p>}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🧾 Account Type</h2>
          <ToggleSwitch
            checked={formData.isBusiness}
            label="Business Account"
            onChange={checked => setFormData(prev => ({ ...prev, isBusiness: checked }))}
          />
        </div>
        <div>
          <Button color="blue" type="submit" className="w-full mt-4">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
