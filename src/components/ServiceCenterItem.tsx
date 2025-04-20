import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

interface ServiceCenter {
    ServiceCenterId: string;
    ServiceCenterName: string;
    LocationName: string;
}

interface ServiceCenterItemProps {
    serviceCenter: ServiceCenter;
    onPress: (center: ServiceCenter) => void;
}

export const ServiceCenterItem: React.FC<ServiceCenterItemProps> = ({
    serviceCenter,
    onPress,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onPress(serviceCenter);
        navigate("/servicesAndGroups");
    };

    return (
        <Button
            className="w-full text-lg sm:text-xl text-center px-6 py-6 h-auto whitespace-normal break-words"
            color="primary"
            onPress={handleClick}
        >
            {serviceCenter.ServiceCenterName}
        </Button>
    );
};
