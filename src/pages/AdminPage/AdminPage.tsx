import React, { useState } from "react";
import { CentersList } from "../../components/admin/CentersList/CentersList";
import { RegistrationsList } from "../../components/admin/RegistrationsList/RegistrationsList";
import { ServiceList } from "../../components/admin/ServicesList/ServicesList";

type Tab = "centers" | "services" | "registrations";

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>("centers");

    return (
        <div className="container-primary max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex justify-center gap-4 mb-8">
                <button
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                        activeTab === "centers" ? "bg-blue-600" : "bg-gray-400"
                    }`}
                    onClick={() => setActiveTab("centers")}
                >
                    Центри
                </button>
                <button
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                        activeTab === "services" ? "bg-blue-600" : "bg-gray-400"
                    }`}
                    onClick={() => setActiveTab("services")}
                >
                    Сервіси
                </button>
                <button
                    className={`px-6 py-2 rounded-md text-white font-medium ${
                        activeTab === "registrations"
                            ? "bg-blue-600"
                            : "bg-gray-400"
                    }`}
                    onClick={() => setActiveTab("registrations")}
                >
                    Реєстрації
                </button>
            </div>

            <div>
                {activeTab === "centers" && <CentersList />}
                {activeTab === "services" && <ServiceList />}
                {activeTab === "registrations" && <RegistrationsList />}
            </div>
        </div>
    );
};

export default AdminPage;
