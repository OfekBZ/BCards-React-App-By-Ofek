import { useState } from "react";
import { FloatingLabel, ToggleSwitch, Button } from "flowbite-react";
import axios from "axios";

type FormDataType = {
  name: { first: string; middle: string; last: string };
  image: { url: string; alt: string };
  address: {
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
  isBusiness: boolean;
  email: string;
  password: string;
  phone: string;
};

export default function Register() {
  const [formData, setFormData] = useState<FormDataType>({
    name: { first: "", middle: "", last: "" },
    image: { url: "", alt: "" },
    address: {
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
    },
    isBusiness: false,
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...[parent],
          [child]: parsedValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.first.trim()) newErrors["name.first"] = "First name is required";
    if (!formData.name.last.trim()) newErrors["name.last"] = "Last name is required";
    if (!formData.email.includes("@")) newErrors["email"] = "Invalid email";
    if (formData.password.length < 6) newErrors["password"] = "Password too short";
    if (!/^\d+$/.test(formData.phone)) newErrors["phone"] = "Numbers only";
    if (!formData.address.country) newErrors["address.country"] = "Country required";
    if (!formData.address.city) newErrors["address.city"] = "City required";
    if (!formData.address.street) newErrors["address.street"] = "Street required";
    if (!formData.address.houseNumber || !/^\d+$/.test(formData.address.houseNumber)) newErrors["address.houseNumber"] = "House # must be numeric";
    if (!formData.address.zip || !/^\d+$/.test(formData.address.zip)) newErrors["address.zip"] = "ZIP must be numeric";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try{
        const response = await axios.post("https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users",
    formData
)
console.log("response from API :" , response.data);
alert("user registed successfulyy!")
}catch(error){   
    console.error("reistration error:", error)
    alert("somthing went wrong while registrering")
    }
  };

   
  ;

  const inputClass = "bg-transparent";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-7">
      <h1 className="text-3xl font-semibold dark:text-white">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">👤 Name</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["first", "middle", "last"].map((part) => (
              <div key={part}>
                
                <FloatingLabel
                  variant="outlined"
                  label={`${part} name`}
                  name={`name.${part}`}
                  value={(formData.name as any)[part]}
                  onChange={handleChange}
                  className={inputClass}
                  onKeyDown={(e) => {
                    if (/\d/.test(e.key)) e.preventDefault();
                  }} 
                />
                {errors[`name.${part}`] && (
                  <p className="text-red-500 text-sm">{errors[`name.${part}`]}</p>
                )}
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
              {errors["email"] && (
                <p className="text-red-500 text-sm">{errors["email"]}</p>
              )}
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
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") e.preventDefault();
                }}
              />
              {errors["phone"] && (
                <p className="text-red-500 text-sm">{errors["phone"]}</p>
              )}
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
              {errors["password"] && (
                <p className="text-red-500 text-sm">{errors["password"]}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🖼️ Image Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FloatingLabel
                variant="outlined"
                label="Image URL"
                name="image.url"
                value={formData.image.url}
                onChange={handleChange}
                className={inputClass}
              />
              {errors["image.url"] && (
                <p className="text-red-500 text-sm">{errors["image.url"]}</p>
              )}
            </div>
            <div>
              <FloatingLabel
                variant="outlined"
                label="Image Alt"
                name="image.alt"
                value={formData.image.alt}
                onChange={handleChange}
                className={inputClass}
              />
              {errors["image.alt"] && (
                <p className="text-red-500 text-sm">{errors["image.alt"]}</p>
              )}
            </div>
          </div>
        </div>
        {/* 🏠 Address Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🏠 Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["state", "country", "city", "street", "houseNumber", "zip"].map((field) => (
              <div key={field}>
                <FloatingLabel
                  variant="outlined"
                  label={field.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase())}
                  name={`address.${field}`}
                  value={(formData.address as any)[field]}
                  onChange={handleChange}
                  className={inputClass}
                  onKeyDown={(e) => {
                    if (
                      ["houseNumber", "zip"].includes(field) &&
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors[`address.${field}`] && (
                  <p className="text-red-500 text-sm">{errors[`address.${field}`]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        
        <div>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">🧾 Account Type</h2>
          <ToggleSwitch
            checked={formData.isBusiness}
            label="Business Account"
            onChange={(checked) =>
              setFormData({ ...formData, isBusiness: checked })
            }
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
