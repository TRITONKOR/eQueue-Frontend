import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
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

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}`
            )
            .then((response) => {
                const data = response.data;
                if (data && Array.isArray(data.d)) {
                    setServices(data.d);
                } else {
                    console.error("Services not found or 'd' is not an array");
                }
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            });
    }, []);

    const filteredServices = services.filter((service) =>
        service.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container flex flex-col items-center justify-center mx-auto p-6 bg-white shadow-lg rounded-lg  sm:my-auto">
            <h1 className="h1-primary">
                Будь ласка, оберіть необхідну послугу
            </h1>

            <p className="mb-5 text-lg sm:text-2xl text-center">
                {selectedCenter?.ServiceCenterName}
            </p>

            <Input
                type="text"
                placeholder="Пошук сервісу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 mb-6"
                size="lg"
                classNames={{ input: " text-lg" }}
            />

            <div className="flex flex-col overflow-auto max-h-[500px] max-w-xs sm:max-w-full gap-5 px-6 justify-center">
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
    );
};
