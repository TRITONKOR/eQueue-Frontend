import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReceipt } from "../../context/ReceiptContext";
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
    const { setReceipt } = useReceipt();

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

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

        setLoading(true);
        try {
            fetchAvailableDates(
                selectedCenter.ServiceCenterId,
                selectedService.ServiceId
            )
                .then((dates) => {
                    setAvailableDates(dates);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching dates:", error);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error fetching dates:", error);
            setLoading(false);
        }
    }, [selectedService, selectedCenter, userProfile, navigate]);

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
                    const { CustOrderGuid, CustReceiptNum } = response.data.d;

                    setReceipt({
                        CustOrderGuid,
                        CustReceiptNum,
                        selectedDate,
                        selectedTime,
                    });

                    navigate("/receipt");
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
        <>
            {loading ? (
                <Spinner size="lg" label="Завантаження дат" />
            ) : (
                <div className="container-primary">
                    <h1 className="h1-primary">Попередній запис</h1>

                    <p className="mb-5 text-2xl text-center">
                        Будь ласка, оберіть бажаний час візиту
                    </p>

                    <p className="mb-5 text-2xl text-center font-bold">
                        {selectedService?.Description}
                    </p>

                    <div className="flex  place-content-center gap-4 flex-wrap w-1/2 mx-auto">
                        <Select
                            items={availableDates.map((date) => ({
                                label: date,
                            }))}
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
                            items={availableTimes.map((time) => ({
                                label: time,
                            }))}
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
                            className="btn-primary order-2 sm:order-1"
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
            )}
        </>
    );
};
