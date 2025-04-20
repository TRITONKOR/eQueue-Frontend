import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceItem } from "../../components/ServiceItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";

interface Service {
    Description: string;
    ServiceCenterId: string;
    ServiceId: string;
}

const CACHE_EXPIRY = 15 * 60 * 1000;

export const ServicesPage: React.FC = () => {
    const { userProfile } = useUser();
    const { selectedCenter } = useServiceCenter();
    const { setSelectedService } = useService();

    const [services, setServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (selectedCenter === null) {
            navigate("/serviceCenters");
        }

        const cacheKey = `serviceCache_${selectedCenter?.ServiceCenterId}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (parsedData.expiry > Date.now()) {
                setServices(parsedData.data);
                setLoading(false);
                return;
            }
        }
        fetchServices(cacheKey);
    }, [navigate, organizationGuid, selectedCenter, userProfile.firstName]);

    const fetchServices = async (cacheKey: string) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}`
            );

            const data = response.data;

            if (data && Array.isArray(data)) {
                setServices(data);
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        data: data,
                        expiry: Date.now() + CACHE_EXPIRY,
                    })
                );
            } else {
                console.error(
                    "ServiceCenters not found or 'data' is not an array"
                );
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter((service) =>
        service.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-primary max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner size="lg" label="Завантаження послуг..." />
                </div>
            ) : (
                <>
                    <div className="text-center mb-10">
                        <h1 className="h1-primary mb-4">Оберіть послугу</h1>
                        <p className="text-xl text-gray-600">
                            {selectedCenter?.ServiceCenterName}
                        </p>
                    </div>

                    <div className="mb-8 w-full max-w-md mx-auto">
                        <Input
                            type="search"
                            placeholder="Пошук послуг..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full mx-auto"
                            size="lg"
                            classNames={{
                                input: "form-input__field",
                                inputWrapper: "form-input__wrapper",
                            }}
                        />
                    </div>

                    {filteredServices.length > 0 ? (
                        <div
                            className={`grid ${
                                filteredServices.length === 1
                                    ? "justify-items-center"
                                    : ""
                            } gap-6 mb-8`}
                        >
                            <div
                                className={`grid ${
                                    filteredServices.length === 1
                                        ? "md:grid-cols-1 max-w-md"
                                        : "md:grid-cols-2"
                                } gap-6`}
                            >
                                {filteredServices.map((service) => (
                                    <ServiceItem
                                        key={service.ServiceId}
                                        service={service}
                                        onPress={setSelectedService}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 rounded-lg p-6 text-center mb-8">
                            <p className="text-lg text-gray-700">
                                Не знайдено послуг за вашим запитом
                            </p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button
                            className="btn-primary px-8 py-3"
                            color="primary"
                            onPress={() => navigate("/serviceCenters")}
                        >
                            ⬅️ Повернутися до центрів
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
