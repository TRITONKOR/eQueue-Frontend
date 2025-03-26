import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceCenterItem } from "../../components/ServiceCenterItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useUser } from "../../context/UserContext";

interface ServiceCenter {
    BranchName: string;
    ServiceCenterId: number;
    ServiceCenterName: string;
    LocationName: string;
}

export const ServiceCentersPage: React.FC = () => {
    const { userProfile } = useUser();
    const { setSelectedCenter } = useServiceCenter();
    const navigate = useNavigate();

    const [centers, setCenters] = useState<ServiceCenter[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/getServiceCenterList?organisationGuid={${organizationGuid}}`
            )
            .then((response) => {
                const data = response.data;
                if (data && Array.isArray(data.d)) {
                    setCenters(data.d);
                } else {
                    console.error(
                        "ServiceCenters not found or 'd' is not an array"
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching service centers:", error);
            });
    }, []);

    const filteredCenters = centers.filter((service) =>
        service.ServiceCenterName.toLowerCase().includes(
            searchQuery.toLowerCase()
        )
    );

    return (
        <div className="container flex flex-col items-center justify-center mx-auto p-6 bg-white shadow-lg rounded-lg max-w-full min-h-screen sm:min-h-full sm:max-w-4xl sm:my-auto">
            <h1 className="h1-primary">Попередній запис</h1>

            <p className="mb-5 text-2xl text-center">
                Будь ласка, оберіть ЦНАП, або його територіальний підрозділ
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

            <div className="flex flex-col overflow-auto max-h-[500px] items-center w-full gap-4 px-6">
                {filteredCenters.map((center: ServiceCenter) => (
                    <ServiceCenterItem
                        key={center.ServiceCenterId}
                        serviceCenter={center}
                        onPress={setSelectedCenter}
                    />
                ))}
            </div>

            <Button
                className="btn-primary sm:w-auto"
                color="primary"
                onPress={() => navigate("/profile")}
            >
                Повернутися назад
            </Button>
        </div>
    );
};
