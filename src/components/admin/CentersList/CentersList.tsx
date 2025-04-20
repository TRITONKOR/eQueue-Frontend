// CentersList.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import CenterItem, { CenterItemProps } from "./CenterItem";

export const CentersList: React.FC = () => {
    const [centers, setCenters] = useState<CenterItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [newCenterName, setNewCenterName] = useState<string>("");
    const [newCenterLocation, setNewCenterLocation] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [formErrors, setFormErrors] = useState({
        name: "",
        location: "",
    });

    useEffect(() => {
        const fetchCenters = async () => {
            const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;
            try {
                const res = await axios.get(
                    `/api/getServiceCenterList?organisationGuid={${organizationGuid}}`
                );
                setCenters(res.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCenters();
    }, []);

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: "",
            location: "",
        };

        if (!newCenterName.trim()) {
            newErrors.name = "Назва центру обов'язкова";
            valid = false;
        } else if (newCenterName.length > 100) {
            newErrors.name = "Назва не повинна перевищувати 100 символів";
            valid = false;
        }

        if (!newCenterLocation.trim()) {
            newErrors.location = "Локація обов'язкова";
            valid = false;
        } else if (newCenterLocation.length > 200) {
            newErrors.location = "Локація не повинна перевищувати 200 символів";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleDeleteCenter = async (id: string) => {
        try {
            await axios.delete(`/api/service-centers/${id}`);
            setCenters((prev) => prev.filter((c) => c.ServiceCenterId !== id));
        } catch (err) {
            console.error("Помилка видалення центру", err);
        }
    };

    const handleCreateCenter = async () => {
        if (!validateForm()) return;

        const newCenter = {
            name: newCenterName.trim(),
            location: newCenterLocation.trim(),
            isActive,
        };

        try {
            const res = await axios.post("/api/service-centers", newCenter);

            const formattedCenter: CenterItemProps = {
                ServiceCenterId: res.data.id,
                ServiceCenterName: res.data.name,
                LocationName: res.data.location,
                IsActive: res.data.isActive,
            };

            setCenters((prev) => [...prev, formattedCenter]);

            // Reset form
            setNewCenterName("");
            setNewCenterLocation("");
            setIsActive(true);
            setFormErrors({ name: "", location: "" });
        } catch (err) {
            console.error("Помилка створення центру", err);
        }
    };

    const handleUpdateCenter = async (updated: {
        id: string;
        name: string;
        location: string;
        isActive: boolean;
    }) => {
        try {
            await axios.put(`/api/service-centers/${updated.id}`, {
                name: updated.name,
                location: updated.location,
                isActive: updated.isActive,
            });

            setCenters((prev) =>
                prev.map((c) =>
                    c.ServiceCenterId === updated.id
                        ? {
                              ...c,
                              ServiceCenterName: updated.name,
                              LocationName: updated.location,
                              IsActive: updated.isActive,
                          }
                        : c
                )
            );
        } catch (err) {
            console.error("Помилка оновлення центру", err);
        }
    };

    if (loading) return <p>Завантаження центрів...</p>;
    if (error) return <p className="text-red-500">Помилка: {error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Список центрів</h1>

            <div className="mb-6 bg-gray-100 p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">
                    Додати новий центр
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Назва центру"
                            value={newCenterName}
                            onChange={(e) => setNewCenterName(e.target.value)}
                            className={`w-full p-2 border rounded ${
                                formErrors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Локація"
                            value={newCenterLocation}
                            onChange={(e) =>
                                setNewCenterLocation(e.target.value)
                            }
                            className={`w-full p-2 border rounded ${
                                formErrors.location
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {formErrors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.location}
                            </p>
                        )}
                    </div>
                    <div>
                        <select
                            value={isActive ? "active" : "inactive"}
                            onChange={(e) =>
                                setIsActive(e.target.value === "active")
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="active">Активний</option>
                            <option value="inactive">Неактивний</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleCreateCenter}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    ➕ Додати центр
                </button>
            </div>

            {centers.length > 0 ? (
                centers.map((center) => (
                    <CenterItem
                        key={center.ServiceCenterId}
                        ServiceCenterId={center.ServiceCenterId}
                        ServiceCenterName={center.ServiceCenterName}
                        LocationName={center.LocationName}
                        IsActive={center.IsActive}
                        onDelete={handleDeleteCenter}
                        onUpdate={handleUpdateCenter}
                    />
                ))
            ) : (
                <p>Центри не знайдено.</p>
            )}
        </div>
    );
};
