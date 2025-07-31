import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import addSignImage from "./Images/add_sign.jpg";


interface AddressData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
}

const Address: React.FC = () => {
    const [addresses, setAddresses] = useState<AddressData[]>([]);

    useEffect(() => {
        const allKeys = Object.keys(localStorage);
        const submissionKeys = allKeys.filter((key) =>
            key.startsWith("submission_")
        );

        const loadedAddress = submissionKeys
            .map((key) => {
                try {
                    const item = localStorage.getItem(key)!;
                    const data = JSON.parse(item);
                    return { id: key, ...data };
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        setAddresses(loadedAddress as AddressData[]);
    }, []);

    const handleDelete = (idToDelete : string) => {
        localStorage.removeItem(idToDelete);
        setAddresses(currentAddresses => currentAddresses.filter(
            address => address.id !== idToDelete
        ));
    }; 

    const navigate = useNavigate();

    const handleEdit = (idToEdit: string) => {
        navigate(`/edit-address/${idToEdit}`);
    };

    return (
        <div>
            <h1 className="pt-4 text-2xl font-bold uppercase text-center">
                User Address
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-10">
                <div className="aspect-square bg-gray-200 border border-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-300 transition">
                    <Link to="/createAddress" className="w-full h-full flex items-center justify-center">
                        {/* Use the imported image variable */}
                        <img src={addSignImage} alt="Add Address" className="w-1/2 h-1/2 object-contain"/>
                    </Link>
                </div>

                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="aspect-square bg-white border border-gray-300 rounded-lg p-3 pl-6 flex flex-col justify-center text-sm shadow"
                    >
                        <p className="font-bold text-gray-800 truncate">
                            {addr.firstName} {addr.lastName}
                        </p>
                        <p className="font-bold text-gray-800 truncate">
                            {addr.email}
                        </p>
                        <p className="text-gray-600 break-words mt-1 mb-4">
                            {addr.address}
                        </p>

                        <button onClick={()=>{handleEdit(addr.id)}} className="p-1 m-1 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">Edit Address</button>

                        <button onClick={()=>{handleDelete(addr.id)}} className="p-1 m-1 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">Delete Address</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Address;