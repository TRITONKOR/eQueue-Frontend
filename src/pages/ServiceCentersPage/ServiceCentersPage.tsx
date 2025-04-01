import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
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
    const [loading, setLoading] = useState<boolean>(true);

    const allowedServiceCenterIds = [1, 2];

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        setLoading(true);
        try {
            axios
                .get(
                    `/api/QueueService.svc/json_pre_reg_https/getServiceCenterList?organisationGuid={${organizationGuid}}`
                )
                .then((response) => {
                    const data = response.data;
                    if (data && Array.isArray(data.d)) {
                        const filteredCenters = data.d.filter(
                            (center: ServiceCenter) =>
                                allowedServiceCenterIds.includes(
                                    center.ServiceCenterId
                                )
                        );
                        setCenters(filteredCenters);
                    } else {
                        console.error(
                            "ServiceCenters not found or 'd' is not an array"
                        );
                    }
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error fetching service centers:", error);
            setLoading(false);
        }
    }, [navigate, organizationGuid, userProfile.firstName]);

    const filteredCenters = centers.filter((service) =>
        service.ServiceCenterName.toLowerCase().includes(
            searchQuery.toLowerCase()
        )
    );

    return (
        <>
            {loading ? (
                <Spinner size="lg" label="Завантаження центрів" />
            ) : (
                <div className="container-primary">
                    <h1 className="h1-primary">Попередній запис</h1>

                    <p className="mb-5 text-2xl text-center">
                        Будь ласка, оберіть ЦНАП, або його територіальний
                        підрозділ
                    </p>

                    <Input
                        type="text"
                        placeholder="Пошук сервісного центру..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-6 mb-6"
                        size="lg"
                        classNames={{ input: " text-lg" }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-auto max-h-[500px] max-w-full px-6 justify-center">
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
            )}
        </>
    );
};
