// RegistrationsList.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CenterOption, RawService } from "../ServicesList/ServicesList";
import RegistrationItem, { RegistrationItemProps } from "./RegistrationItem";

const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

export const RegistrationsList: React.FC = () => {
    const [centers, setCenters] = useState<CenterOption[]>([]);
    const [selectedCenterId, setSelectedCenterId] = useState<string>("");
    const [services, setServices] = useState<RawService[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [registrations, setRegistrations] = useState<RegistrationItemProps[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [newRegistration, setNewRegistration] = useState({
        clientFullName: "",
        clientEmail: "",
        clientPhone: "",
        clientLegalPersonName: "",
        serviceDate: "",
        serviceTime: "",
    });
    const [formErrors, setFormErrors] = useState({
        clientFullName: "",
        clientPhone: "",
        clientEmail: "",
        serviceDate: "",
        serviceTime: "",
    });

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await axios.get(
                    `https://equeue-server-production.up.railway.app/api/getServiceCenterList?organisationGuid={${organizationGuid}}`
                );
                setCenters(res.data);
            } catch (err) {
                console.error("Не вдалося завантажити центри", err);
                setError("Не вдалося завантажити центри.");
            }
        };
        fetchCenters();
    }, []);

    useEffect(() => {
        if (!selectedCenterId) return;
        const fetchServices = async () => {
            try {
                const res = await axios.get<RawService[]>(
                    `https://equeue-server-production.up.railway.app/api/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenterId}`
                );
                setServices(res.data);
            } catch (err) {
                console.error("Не вдалося завантажити сервіси", err);
                setError("Не вдалося завантажити сервіси.");
            }
        };
        fetchServices();
    }, [selectedCenterId]);

    useEffect(() => {
        if (!selectedServiceId) return;
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const res = await axios.get<RegistrationItemProps[]>(
                    `https://equeue-server-production.up.railway.app/api/services/${selectedServiceId}/registrations`
                );
                setRegistrations(res.data);
            } catch (err) {
                console.error("Не вдалося завантажити реєстрації", err);
                setError("Не вдалося завантажити реєстрації.");
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [selectedServiceId]);

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            clientFullName: "",
            clientPhone: "",
            clientEmail: "",
            serviceDate: "",
            serviceTime: "",
        };

        if (!newRegistration.clientFullName.trim()) {
            newErrors.clientFullName = "ПІБ клієнта обов'язкове поле";
            valid = false;
        } else if (newRegistration.clientFullName.length > 100) {
            newErrors.clientFullName = "Максимум 100 символів";
            valid = false;
        }

        if (!newRegistration.clientPhone.trim()) {
            newErrors.clientPhone = "Телефон обов'язковий";
            valid = false;
        }

        if (
            newRegistration.clientEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newRegistration.clientEmail)
        ) {
            newErrors.clientEmail = "Некоректний email";
            valid = false;
        }

        if (!newRegistration.serviceDate) {
            newErrors.serviceDate = "Оберіть дату";
            valid = false;
        }

        if (!newRegistration.serviceTime) {
            newErrors.serviceTime = "Оберіть час";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleDeleteRegistration = async (id: string) => {
        try {
            await axios.delete(
                `https://equeue-server-production.up.railway.app/api/registrations/${id}`
            );
            setRegistrations((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Помилка видалення реєстрації", err);
        }
    };

    const handleCreateRegistration = async () => {
        if (!selectedServiceId) {
            setError("Оберіть сервіс");
            return;
        }

        if (!validateForm()) return;

        const registrationToSend = {
            serviceId: selectedServiceId,
            phone: newRegistration.clientPhone.trim(),
            email: newRegistration.clientEmail.trim(),
            name: newRegistration.clientFullName.trim(),
            customerInfo: newRegistration.clientLegalPersonName.trim(),
            date: `${newRegistration.serviceDate} ${newRegistration.serviceTime}`,
        };

        try {
            const queryParams = new URLSearchParams(
                registrationToSend
            ).toString();
            const res = await axios.post<RegistrationItemProps>(
                `https://equeue-server-production.up.railway.app/api/RegCustomerEx?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenterId}&${queryParams}`
            );

            setRegistrations((prev) => [...prev, res.data]);
            setNewRegistration({
                clientFullName: "",
                clientEmail: "",
                clientPhone: "",
                clientLegalPersonName: "",
                serviceDate: "",
                serviceTime: "",
            });
            setFormErrors({
                clientFullName: "",
                clientPhone: "",
                clientEmail: "",
                serviceDate: "",
                serviceTime: "",
            });
        } catch (err) {
            console.error("Помилка створення реєстрації", err);
            setError("Не вдалося створити реєстрацію");
        }
    };

    const handleUpdateRegistration = async (
        id: string,
        updatedData: Partial<RegistrationItemProps>
    ) => {
        try {
            const registrationToSend = {
                phone: updatedData.clientPhone?.trim() || "",
                email: updatedData.clientEmail?.trim() || "",
                name: updatedData.clientFullName?.trim() || "",
                customerInfo: updatedData.clientLegalPersonName?.trim() || "",
                date: `${updatedData.serviceDate} ${updatedData.serviceTime}`,
            };

            const res = await axios.put(
                `https://equeue-server-production.up.railway.app/api/registrations/${id}`,
                registrationToSend
            );
            setRegistrations((prev) =>
                prev.map((r) => (r.id === id ? res.data : r))
            );
        } catch (err) {
            console.error("Помилка оновлення:", err);
            setError("Не вдалося оновити запис");
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Список реєстрацій</h1>

            <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    Оберіть центр:
                </label>
                <select
                    className="w-full border border-gray-300 rounded p-2"
                    value={selectedCenterId}
                    onChange={(e) => {
                        setSelectedCenterId(e.target.value);
                        setSelectedServiceId("");
                        setServices([]);
                        setRegistrations([]);
                        setError(null);
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
            </div>

            {services.length > 0 && (
                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        Оберіть сервіс:
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded p-2"
                        value={selectedServiceId}
                        onChange={(e) => {
                            setSelectedServiceId(e.target.value);
                            setError(null);
                        }}
                    >
                        <option value="">-- Оберіть сервіс --</option>
                        {services.map((service) => (
                            <option
                                key={service.ServiceId}
                                value={service.ServiceId}
                            >
                                {service.Description}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading && <p>Завантаження реєстрацій...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {selectedServiceId && (
                <div className="mb-6 bg-gray-50 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-3">
                        Нова реєстрація
                    </h2>

                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            ПІБ клієнта *
                        </label>
                        <input
                            className={`w-full border ${
                                formErrors.clientFullName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            value={newRegistration.clientFullName}
                            onChange={(e) => {
                                setNewRegistration({
                                    ...newRegistration,
                                    clientFullName: e.target.value,
                                });
                                if (formErrors.clientFullName)
                                    setFormErrors({
                                        ...formErrors,
                                        clientFullName: "",
                                    });
                            }}
                        />
                        {formErrors.clientFullName && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.clientFullName}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className={`w-full border ${
                                formErrors.clientEmail
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            value={newRegistration.clientEmail}
                            onChange={(e) => {
                                setNewRegistration({
                                    ...newRegistration,
                                    clientEmail: e.target.value,
                                });
                                if (formErrors.clientEmail)
                                    setFormErrors({
                                        ...formErrors,
                                        clientEmail: "",
                                    });
                            }}
                        />
                        {formErrors.clientEmail && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.clientEmail}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Телефон *
                        </label>
                        <input
                            type="tel"
                            className={`w-full border ${
                                formErrors.clientPhone
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } p-2 rounded`}
                            value={newRegistration.clientPhone}
                            onChange={(e) => {
                                setNewRegistration({
                                    ...newRegistration,
                                    clientPhone: e.target.value,
                                });
                                if (formErrors.clientPhone)
                                    setFormErrors({
                                        ...formErrors,
                                        clientPhone: "",
                                    });
                            }}
                        />
                        {formErrors.clientPhone && (
                            <p className="text-red-500 text-xs mt-1">
                                {formErrors.clientPhone}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Назва юр. особи
                        </label>
                        <input
                            className="w-full border border-gray-300 p-2 rounded"
                            value={newRegistration.clientLegalPersonName}
                            onChange={(e) =>
                                setNewRegistration({
                                    ...newRegistration,
                                    clientLegalPersonName: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Дата *
                            </label>
                            <input
                                type="date"
                                className={`w-full border ${
                                    formErrors.serviceDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } p-2 rounded`}
                                value={newRegistration.serviceDate}
                                onChange={(e) => {
                                    setNewRegistration({
                                        ...newRegistration,
                                        serviceDate: e.target.value,
                                    });
                                    if (formErrors.serviceDate)
                                        setFormErrors({
                                            ...formErrors,
                                            serviceDate: "",
                                        });
                                }}
                            />
                            {formErrors.serviceDate && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.serviceDate}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Час *
                            </label>
                            <input
                                type="time"
                                className={`w-full border ${
                                    formErrors.serviceTime
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } p-2 rounded`}
                                value={newRegistration.serviceTime}
                                onChange={(e) => {
                                    setNewRegistration({
                                        ...newRegistration,
                                        serviceTime: e.target.value,
                                    });
                                    if (formErrors.serviceTime)
                                        setFormErrors({
                                            ...formErrors,
                                            serviceTime: "",
                                        });
                                }}
                            />
                            {formErrors.serviceTime && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formErrors.serviceTime}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleCreateRegistration}
                    >
                        ➕ Додати реєстрацію
                    </button>
                </div>
            )}

            {!loading && registrations.length > 0 ? (
                registrations.map((reg) => (
                    <RegistrationItem
                        key={reg.id}
                        {...reg}
                        onDelete={handleDeleteRegistration}
                        onUpdate={handleUpdateRegistration}
                    />
                ))
            ) : !loading && selectedServiceId ? (
                <p className="text-gray-500">
                    Реєстрацій не знайдено для цього сервісу.
                </p>
            ) : null}
        </div>
    );
};
