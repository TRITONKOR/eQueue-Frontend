import axios from "axios";

interface PreRegDay {
    DatePart: string;
    IsAllow: number;
}

interface PreRegTime {
    StartTime: string;
    IsAllow: number;
}

const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

export const fetchAvailableDates = async (
    serviceCenterId: string,
    serviceId: string
): Promise<string[]> => {
    try {
        const response = await axios.get(
            `/api/api/GetDayList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}`
        );

        const data = response.data;

        if (data && Array.isArray(data)) {
            return data
                .filter((day: PreRegDay) => day.IsAllow === 1)
                .map((day: PreRegDay) => formatDate(day.DatePart));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching available dates:", error);
        return [];
    }
};

export const fetchAvailableTimes = async (
    serviceCenterId: string,
    serviceId: string,
    date: string
): Promise<{ time: string; isAvailable: boolean }[]> => {
    try {
        const formattedDate = reformatDate(date);
        const response = await axios.get(
            `/api/api/GetTimeList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}&date=${formattedDate}`
        );

        const data = response.data;

        if (data && Array.isArray(data)) {
            return data.map((time: PreRegTime) => ({
                time: time.StartTime,
                isAvailable: time.IsAllow === 1,
            }));
        } else {
            console.error("Invalid time data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching available times:", error);
        return [];
    }
};

export const formatDate = (datePart: string): string => {
    const date = new Date(datePart); // напряму створюємо об'єкт Date

    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
};

export const reformatDate = (formattedDate: string): string => {
    const [day, month] = formattedDate.split(" ");

    const monthMap: { [key: string]: number } = {
        січня: 0,
        лютого: 1,
        березня: 2,
        квітня: 3,
        травня: 4,
        червня: 5,
        липня: 6,
        серпня: 7,
        вересня: 8,
        жовтня: 9,
        листопада: 10,
        грудня: 11,
    };

    const monthIndex = monthMap[month];

    if (monthIndex === undefined) {
        throw new Error("Invalid month name");
    }

    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, monthIndex, parseInt(day, 10));

    return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
