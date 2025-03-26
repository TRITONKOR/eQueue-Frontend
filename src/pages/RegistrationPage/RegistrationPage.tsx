import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";
import {
    fetchAvailableDates,
    fetchAvailableTimes,
    reformatDate,
} from "../../services/dateService";

export const RegistrationPage: React.FC = () => {
    const { userProfile } = useUser();
    const { selectedService } = useService();
    const { selectedCenter } = useServiceCenter();

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const navigate = useNavigate();

    const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (!selectedService || !selectedCenter || !userProfile) {
            navigate("/servicesAndGroups");
            return;
        }

        fetchAvailableDates(
            selectedCenter.ServiceCenterId,
            selectedService.ServiceId
        )
            .then((dates) => setAvailableDates(dates))
            .catch((error) => console.error("Error fetching dates:", error));
    }, [selectedService, selectedCenter]);

    const handleDateChange = (keys: {
        anchorKey?: string;
        currentKey?: string;
    }) => {
        const date = keys.currentKey as string;
        setSelectedDate(date);

        if (!selectedService || !selectedCenter) {
            navigate("/servicesAndGroups");
            return;
        }

        fetchAvailableTimes(
            selectedCenter.ServiceCenterId,
            selectedService.ServiceId,
            date
        )
            .then((times) => {
                setAvailableTimes(times);
                setSelectedTime(null);
            })
            .catch((error) => console.error("Error fetching times:", error));
    };

    const handleRegistration = () => {
        if (
            !selectedCenter ||
            !selectedService ||
            !selectedDate ||
            !selectedTime ||
            !userProfile
        ) {
            return;
        }

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/RegCustomerEx?organisationGuid={${organizationGuid}}&serviceCenterId=${
                    selectedCenter?.ServiceCenterId
                }&serviceId=${selectedService?.ServiceId}&phone=${
                    userProfile.phone
                }&email=${userProfile.email}&name=${userProfile.lastName} ${
                    userProfile.firstName
                } ${userProfile.middleName}&date=${reformatDate(
                    selectedDate
                )} ${selectedTime}:00`
            )
            .then((response) => {
                const data = response.data;
                if (data) {
                    console.log(data.d);
                } else {
                    console.error("Registration failed");
                }
            })
            .catch((error) => {
                console.error("Error registration:", error);
            });
    };

    const isButtonDisabled = !selectedDate || !selectedTime;

    return (
        <div className="container flex flex-col items-center justify-center mx-auto p-6 bg-white shadow-lg rounded-lg max-w-full min-h-screen sm:min-h-full sm:max-w-4xl sm:my-auto">
            <h1 className="h1-primary">Попередній запис</h1>

            <p className="mb-5 text-2xl text-center">
                Будь ласка, оберіть бажаний час візиту
            </p>

            <p className="mb-5 text-2xl text-center font-bold">
                {selectedService?.Description}
            </p>

            <div className="flex items-center gap-4 flex-wrap w-full">
                <Select
                    items={availableDates.map((date) => ({ label: date }))}
                    label="Оберіть дату"
                    onSelectionChange={handleDateChange}
                    size="lg"
                >
                    {(availableDate) => (
                        <SelectItem key={availableDate.label}>
                            {availableDate.label}
                        </SelectItem>
                    )}
                </Select>
                <Select
                    items={availableTimes.map((time) => ({ label: time }))}
                    label="Оберіть час"
                    onSelectionChange={(keys) =>
                        setSelectedTime(keys.currentKey as string)
                    }
                    size="lg"
                >
                    {(availableTime) => (
                        <SelectItem key={availableTime.label}>
                            {availableTime.label}
                        </SelectItem>
                    )}
                </Select>
            </div>

            <div className="flex justify-center sm:gap-2 flex-wrap">
                <Button
                    className="btn-primary sm:w-auto order-2 sm:order-1"
                    color="primary"
                    onPress={() => navigate("/servicesAndGroups")}
                >
                    Повернутися назад
                </Button>
                <Button
                    className="btn-primary sm:w-auto order-1 sm:order-2"
                    color="primary"
                    onPress={handleRegistration}
                    isDisabled={isButtonDisabled}
                >
                    Зареєструватись
                </Button>
            </div>
        </div>
    );
};
