// ServiceList.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import ServiceItem, { ServiceItemProps } from "./ServiceItem";

export interface CenterOption {
    ServiceCenterId: string;
    ServiceCenterName: string;
    LocationName: string;
}

export interface RawService {
    Description: string;
    ServiceCenterId: string;
    ServiceId: string;
}

const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

export const ServiceList: React.FC = () => {
    const [centers, setCenters] = useState<CenterOption[]>([]);
    const [selectedCenterId, setSelectedCenterId] = useState<string>("");
    const [services, setServices] = useState<ServiceItemProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newDescription, setNewDescription] = useState<string>("");
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await axios.get(
                    `https://equeue-server-production.up.railway.app/api/getServiceCenterList?organisationGuid={${organizationGuid}}`
                );
                setCenters(res.data);
            } catch {
                setError("Не вдалося завантажити центри.");
            }
        };

        fetchCenters();
    }, []);

    useEffect(() => {
        if (!selectedCenterId) return;

        const fetchServices = async () => {
            setLoading(true);
            try {
                const res = await axios.get<RawService[]>(
                    `https://equeue-server-production.up.railway.app/api/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenterId}`
                );

                const selectedCenter = centers.find(
                    (c) => c.ServiceCenterId === selectedCenterId
                );
                const centerName =
                    selectedCenter?.ServiceCenterName || "Невідомий центр";

                const mappedServices: ServiceItemProps[] = res.data.map(
                    (service) => ({
                        id: service.ServiceId,
                        centerName,
                        description: service.Description,
                    })
                );

                setServices(mappedServices);
            } catch {
                setError("Не вдалося завантажити сервіси.");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [selectedCenterId, centers]);

    const validateDescription = (desc: string) => {
        if (!desc.trim()) {
            return "Опис сервісу не може бути порожнім";
        }
        if (desc.length > 200) {
            return "Опис не повинен перевищувати 200 символів";
        }
        return "";
    };

    const handleDeleteService = async (id: string) => {
        try {
            await axios.delete(`/api/services/${id}`);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Помилка видалення сервісу", err);
        }
    };

    const handleCreateService = async () => {
        const validationError = validateDescription(newDescription);
        if (validationError) {
            setFormError(validationError);
            return;
        }

        if (!selectedCenterId) {
            setFormError("Будь ласка, оберіть сервісний центр");
            return;
        }

        try {
            const res = await axios.post(`/api/services`, {
                serviceCenterId: selectedCenterId,
                description: newDescription.trim(),
            });

            const selectedCenter = centers.find(
                (c) => c.ServiceCenterId === selectedCenterId
            );
            const centerName =
                selectedCenter?.ServiceCenterName || "Невідомий центр";

            setServices((prev) => [
                ...prev,
                {
                    id: res.data.id,
                    centerName,
                    description: newDescription.trim(),
                },
            ]);
            setNewDescription("");
            setFormError("");
        } catch (err) {
            console.error("Помилка створення сервісу", err);
            setFormError("Не вдалося створити сервіс");
        }
    };

    const handleUpdateService = async (id: string, newDescription: string) => {
        try {
            await axios.put(
                `https://equeue-server-production.up.railway.app/api/services/${id}`,
                {
                    description: newDescription,
                }
            );

            setServices((prev) =>
                prev.map((s) =>
                    s.id === id ? { ...s, description: newDescription } : s
                )
            );
        } catch (err) {
            console.error("Помилка оновлення сервісу", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Список сервісів</h1>

            <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700">
                    Оберіть сервісний центр:
                </span>
                <select
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    value={selectedCenterId}
                    onChange={(e) => {
                        setSelectedCenterId(e.target.value);
                        setFormError("");
                    }}
                >
                    <option value="">-- Оберіть центр --</option>
                    {centers.map((center) => (
                        <option
                            key={center.ServiceCenterId}
                            value={center.ServiceCenterId}
                        >
                            {center.ServiceCenterName}
                        </option>
                    ))}
                </select>
            </label>

            {selectedCenterId && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Новий сервіс</h2>
                    <div className="mb-2">
                        <input
                            type="text"
                            className={`w-full border ${
                                formError ? "border-red-500" : "border-gray-300"
                            } rounded p-2`}
                            placeholder="Опис сервісу"
                            value={newDescription}
                            onChange={(e) => {
                                setNewDescription(e.target.value);
                                if (formError)
                                    setFormError(
                                        validateDescription(e.target.value)
                                    );
                            }}
                        />
                        {formError && (
                            <p className="text-red-500 text-xs mt-1">
                                {formError}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleCreateService}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ➕ Додати сервіс
                    </button>
                </div>
            )}

            {loading && <p>Завантаження сервісів...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && services.length > 0
                ? services.map((service) => (
                      <ServiceItem
                          key={service.id}
                          id={service.id}
                          centerName={service.centerName}
                          description={service.description}
                          onDelete={handleDeleteService}
                          onUpdate={handleUpdateService}
                      />
                  ))
                : !loading &&
                  selectedCenterId && (
                      <p>Сервіси не знайдено для цього центру.</p>
                  )}
        </div>
    );
};
