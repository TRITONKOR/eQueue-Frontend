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
    ServiceCenterId: number;
    ServiceId: number;
    OrderWeight: number;
}

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
                `/api/QueueService.svc/json_pre_reg_https/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}`
            );
            const data = response.data;
            if (data && Array.isArray(data.d)) {
                setServices(data.d);
                localStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                        data: data.d,
                        expiry: Date.now() + 900000, // 15 minutes
                    })
                );
            } else {
                console.error(
                    "ServiceCenters not found or 'd' is not an array"
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
        <>
            {loading ? (
                <Spinner size="lg" label="Завантаження послуг" />
            ) : (
                <div className="container-primary">
                    <h1 className="h1-primary">
                        Будь ласка, оберіть необхідну послугу
                    </h1>

                    <p className="mb-5 text-lg sm:text-2xl text-center">
                        {selectedCenter?.ServiceCenterName}
                    </p>

                    <Input
                        type="text"
                        placeholder="Пошук послуг..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-6 mb-6"
                        size="lg"
                        classNames={{ input: " text-lg" }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full overflow-auto max-h-[500px] px-6 justify-center">
                        {filteredServices.map((service: Service) => (
                            <ServiceItem
                                key={service.ServiceId}
                                service={service}
                                onPress={setSelectedService}
                            />
                        ))}
                    </div>

                    <Button
                        className="btn-primary sm:w-auto"
                        color="primary"
                        onPress={() => navigate("/serviceCenters")}
                    >
                        Повернутися назад
                    </Button>
                </div>
            )}
        </>
    );
};
