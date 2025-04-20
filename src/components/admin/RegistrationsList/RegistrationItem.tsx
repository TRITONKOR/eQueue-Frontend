// RegistrationItem.tsx
import React, { useState } from "react";

export interface RegistrationItemProps {
    id: string;
    clientFullName: string;
    clientEmail?: string;
    clientPhone: string;
    clientLegalPersonName?: string;
    serviceDate: string;
    serviceTime: string;
    onDelete?: (id: string) => void;
    onUpdate?: (
        id: string,
        updatedData: Partial<RegistrationItemProps>
    ) => void;
}

const RegistrationItem: React.FC<RegistrationItemProps> = ({
    id,
    clientFullName,
    clientEmail,
    clientPhone,
    clientLegalPersonName,
    serviceDate,
    serviceTime,
    onDelete,
    onUpdate,
}) => {
    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        clientFullName,
        clientEmail: clientEmail || "",
        clientPhone,
        clientLegalPersonName: clientLegalPersonName || "",
        serviceDate,
        serviceTime,
    });
    const [errors, setErrors] = useState({
        clientFullName: "",
        clientPhone: "",
        clientEmail: "",
        serviceDate: "",
        serviceTime: "",
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            clientFullName: "",
            clientPhone: "",
            clientEmail: "",
            serviceDate: "",
            serviceTime: "",
        };

        if (!editedData.clientFullName.trim()) {
            newErrors.clientFullName = "ПІБ клієнта обов'язкове поле";
            valid = false;
        } else if (editedData.clientFullName.length > 100) {
            newErrors.clientFullName = "Максимум 100 символів";
            valid = false;
        }

        if (!editedData.clientPhone.trim()) {
            newErrors.clientPhone = "Телефон обов'язковий";
            valid = false;
        }

        if (
            editedData.clientEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedData.clientEmail)
        ) {
            newErrors.clientEmail = "Некоректний email";
            valid = false;
        }

        if (!editedData.serviceDate) {
            newErrors.serviceDate = "Оберіть дату";
            valid = false;
        }

        if (!editedData.serviceTime) {
            newErrors.serviceTime = "Оберіть час";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleDelete = () => {
        if (onDelete) onDelete(id);
    };

    const handleSave = () => {
        if (validateForm() && onUpdate) {
            onUpdate(id, {
                clientFullName: editedData.clientFullName.trim(),
                clientEmail: editedData.clientEmail.trim(),
                clientPhone: editedData.clientPhone.trim(),
                clientLegalPersonName: editedData.clientLegalPersonName.trim(),
                serviceDate: editedData.serviceDate,
                serviceTime: editedData.serviceTime,
            });
            setEditing(false);
        }
    };

    return (
        <div className="p-4 mb-3 bg-white border border-gray-200 rounded shadow">
            {editing ? (
                <div className="mb-2">
                    <div className="mb-2">
                        <input
                            type="text"
                            value={editedData.clientFullName}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    clientFullName: e.target.value,
                                });
                                if (errors.clientFullName)
                                    setErrors({
                                        ...errors,
                                        clientFullName: "",
                                    });
                            }}
                            className={`w-full border ${
                                errors.clientFullName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            placeholder="ПІБ клієнта *"
                        />
                        {errors.clientFullName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.clientFullName}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <input
                            type="email"
                            value={editedData.clientEmail}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    clientEmail: e.target.value,
                                });
                                if (errors.clientEmail)
                                    setErrors({ ...errors, clientEmail: "" });
                            }}
                            className={`w-full border ${
                                errors.clientEmail
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            placeholder="Email"
                        />
                        {errors.clientEmail && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.clientEmail}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <input
                            type="tel"
                            value={editedData.clientPhone}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    clientPhone: e.target.value,
                                });
                                if (errors.clientPhone)
                                    setErrors({ ...errors, clientPhone: "" });
                            }}
                            className={`w-full border ${
                                errors.clientPhone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            placeholder="Телефон *"
                        />
                        {errors.clientPhone && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.clientPhone}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <input
                            type="text"
                            value={editedData.clientLegalPersonName}
                            onChange={(e) =>
                                setEditedData({
                                    ...editedData,
                                    clientLegalPersonName: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Назва юридичної особи"
                        />
                    </div>

                    <div className="mb-2">
                        <input
                            type="date"
                            value={editedData.serviceDate}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    serviceDate: e.target.value,
                                });
                                if (errors.serviceDate)
                                    setErrors({ ...errors, serviceDate: "" });
                            }}
                            className={`w-full border ${
                                errors.serviceDate
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                        />
                        {errors.serviceDate && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.serviceDate}
                            </p>
                        )}
                    </div>

                    <div className="mb-2">
                        <input
                            type="time"
                            value={editedData.serviceTime}
                            onChange={(e) => {
                                setEditedData({
                                    ...editedData,
                                    serviceTime: e.target.value,
                                });
                                if (errors.serviceTime)
                                    setErrors({ ...errors, serviceTime: "" });
                            }}
                            className={`w-full border ${
                                errors.serviceTime
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                        />
                        {errors.serviceTime && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.serviceTime}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {clientFullName}
                    </h2>
                    <p className="text-sm text-gray-500">📞 {clientPhone}</p>
                    {clientEmail && (
                        <p className="text-sm text-gray-500">
                            ✉️ {clientEmail}
                        </p>
                    )}
                    {clientLegalPersonName && (
                        <p className="text-sm text-gray-500">
                            🏢 {clientLegalPersonName}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">
                        🗓 {serviceDate} 🕒 {serviceTime}
                    </p>
                    <p className="text-xs text-gray-400">ID: {id}</p>
                </div>
            )}

            <div className="flex gap-3 mt-2">
                {editing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                            💾 Зберегти
                        </button>
                        <button
                            onClick={() => {
                                setEditedData({
                                    clientFullName,
                                    clientEmail: clientEmail || "",
                                    clientPhone,
                                    clientLegalPersonName:
                                        clientLegalPersonName || "",
                                    serviceDate,
                                    serviceTime,
                                });
                                setEditing(false);
                                setErrors({
                                    clientFullName: "",
                                    clientPhone: "",
                                    clientEmail: "",
                                    serviceDate: "",
                                    serviceTime: "",
                                });
                            }}
                            className="text-gray-600 hover:underline text-sm"
                        >
                            ❌ Скасувати
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            ✏️ Редагувати
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:underline text-sm"
                        >
                            🗑️ Видалити
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegistrationItem;
