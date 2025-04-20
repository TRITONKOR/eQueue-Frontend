// CenterItem.tsx
import React, { useState } from "react";

export interface CenterItemProps {
    ServiceCenterId: string;
    ServiceCenterName: string;
    LocationName: string;
    IsActive: boolean;
    onDelete?: (id: string) => void;
    onUpdate?: (updated: {
        id: string;
        name: string;
        location: string;
        isActive: boolean;
    }) => void;
}

const CenterItem: React.FC<CenterItemProps> = ({
    ServiceCenterId,
    ServiceCenterName,
    LocationName,
    IsActive,
    onDelete,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(ServiceCenterName);
    const [location, setLocation] = useState(LocationName);
    const [active, setActive] = useState(IsActive);
    const [errors, setErrors] = useState({
        name: "",
        location: "",
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: "",
            location: "",
        };

        if (!name.trim()) {
            newErrors.name = "Назва центру обов'язкова";
            valid = false;
        } else if (name.length > 100) {
            newErrors.name = "Назва не повинна перевищувати 100 символів";
            valid = false;
        }

        if (!location.trim()) {
            newErrors.location = "Локація обов'язкова";
            valid = false;
        } else if (location.length > 200) {
            newErrors.location = "Локація не повинна перевищувати 200 символів";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleDelete = () => {
        if (onDelete) onDelete(ServiceCenterId);
    };

    const handleSave = () => {
        if (validateForm() && onUpdate) {
            onUpdate({
                id: ServiceCenterId,
                name: name.trim(),
                location: location.trim(),
                isActive: active,
            });
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col p-4 bg-white rounded shadow border border-gray-200 mb-3">
            {isEditing ? (
                <>
                    <div className="mb-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full p-2 border rounded ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Назва центру"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="mb-2">
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={`w-full p-2 border rounded ${
                                errors.location
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Локація"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.location}
                            </p>
                        )}
                    </div>
                    <div className="mb-2">
                        <select
                            value={active ? "active" : "inactive"}
                            onChange={(e) =>
                                setActive(e.target.value === "active")
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="active">Активний</option>
                            <option value="inactive">Неактивний</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                            💾 Зберегти
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setErrors({ name: "", location: "" });
                                setName(ServiceCenterName);
                                setLocation(LocationName);
                                setActive(IsActive);
                            }}
                            className="text-gray-600 hover:underline"
                        >
                            ❌ Скасувати
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {ServiceCenterName}
                        </h2>
                        <p className="text-sm text-gray-500">
                            📍 {LocationName}
                        </p>
                        <p className="text-xs text-gray-400">
                            ID: {ServiceCenterId}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-block w-3 h-3 rounded-full ${
                                IsActive ? "bg-green-500" : "bg-red-500"
                            }`}
                            title={IsActive ? "Активний" : "Неактивний"}
                        />
                        <span className="text-sm text-gray-700">
                            {IsActive ? "Активний" : "Неактивний"}
                        </span>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 text-sm hover:underline"
                        >
                            ✏️ Редагувати
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 text-sm hover:underline"
                        >
                            🗑️ Видалити
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CenterItem;
