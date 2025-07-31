import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
}

const Form: React.FC = () => {
  const navigate = useNavigate();

  const { addressId } = useParams<{ addressId: string }>();
  const isEditMode = !!addressId;

  const LOCAL_STORAGE_KEY = "formData";

  const [formData, setFormData] = useState<FormData>(() => {
    if (isEditMode) {
      const editData = localStorage.getItem(addressId);
      if (editData) {
        try {
          return JSON.parse(editData);
        } catch {
          return { firstName: "", lastName: "", email: "", address: "" };
        }
      }
    }

    return {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
    };
  });

  useEffect(() => {
    console.log("Saving to local storage...", formData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode) {
      localStorage.setItem(addressId, JSON.stringify(formData));
      alert("Address updated successfully!");
    } else {
      const currentAddress = formData.address.trim();
      if (!currentAddress) {
        alert("The address field cannot be empty.");
        return;
      }

      const allKeys = Object.keys(localStorage);
      const submissionKeys = allKeys.filter((key) =>
        key.startsWith("submission_")
      );

      const isDuplicate = submissionKeys.some((key) => {
        try {
          const savedItem = localStorage.getItem(key)!;
          const savedData = JSON.parse(savedItem);

          if (savedData && typeof savedData.address === "string") {
            const savedAddress = savedData.address.trim().toLowerCase();
            const areTheyEqual = savedAddress === currentAddress.toLowerCase();
            return areTheyEqual;
          }
          return false;
        } catch (error) {
          console.error(`  ...Error parsing data for key ${key}`, error);
          return false;
        }
      });

      if (isDuplicate) {
        alert("This address has already been saved.");
      } else {
        alert("New address saved successfully!");
        const submissionKey = `submission_${crypto.randomUUID()}`;
        localStorage.setItem(submissionKey, JSON.stringify(formData));
        setFormData({ firstName: "", lastName: "", email: "", address: "" });
      }
    }

    navigate("/address");
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-2xl font-bold p-4">
          {" "}
          {isEditMode ? "Edit Address" : "Add Address"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm mb-2 font-semibold text-gray-700 pl-5"
            >
              First Name :
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="block ml-5 mb-4 mt-2 px-2 py-2 w-50% text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-semibold text-gray-700 pl-5"
            >
              Last Name :
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="block ml-5 mb-4 mt-2 px-2 py-2 w-50% text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-700 pl-5"
            >
              Email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-50% ml-5 px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-semibold text-gray-700 pl-5"
            >
              Address :
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="block max-w-1/2 mb-4 ml-5 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-50% ml-5 px-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
