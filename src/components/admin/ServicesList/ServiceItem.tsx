// ServiceItem.tsx
import React, { useState } from "react";

export interface ServiceItemProps {
    id: string;
    centerName: string;
    description: string;
    onDelete?: (id: string) => void;
    onUpdate?: (id: string, newDescription: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
    id,
    centerName,
    description,
    onDelete,
    onUpdate,
}) => {
    const [editing, setEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);
    const [error, setError] = useState("");

    const handleDelete = () => {
        if (onDelete) onDelete(id);
    };

    const validateDescription = (desc: string) => {
        if (!desc.trim()) {
            return "Опис сервісу не може бути порожнім";
        }
        if (desc.length > 200) {
            return "Опис не повинен перевищувати 200 символів";
        }
        return "";
    };

    const handleSave = () => {
        const validationError = validateDescription(editedDescription);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (onUpdate) {
            onUpdate(id, editedDescription.trim());
            setEditing(false);
            setError("");
        }
    };

    return (
        <div className="flex items-start justify-between p-4 bg-white rounded shadow border border-gray-200 mb-3">
            <div className="w-full">
                {editing ? (
                    <div>
                        <input
                            type="text"
                            value={editedDescription}
                            onChange={(e) => {
                                setEditedDescription(e.target.value);
                                if (error)
                                    setError(
                                        validateDescription(e.target.value)
                                    );
                            }}
                            className={`w-full border ${
                                error ? "border-red-500" : "border-gray-300"
                            } p-2 mb-1 rounded`}
                        />
                        {error && (
                            <p className="text-red-500 text-xs mb-2">{error}</p>
                        )}
                    </div>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {description}
                        </h2>
                        <p className="text-sm text-gray-500">{centerName}</p>
                        <p className="text-xs text-gray-400">ID: {id}</p>
                    </>
                )}
                <div className="flex gap-3 mt-2">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="text-green-600 text-sm hover:underline"
                            >
                                💾 Зберегти
                            </button>
                            <button
                                onClick={() => {
                                    setEditedDescription(description);
                                    setEditing(false);
                                    setError("");
                                }}
                                className="text-gray-500 text-sm hover:underline"
                            >
                                ❌ Скасувати
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setEditing(true)}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceItem;
