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
    serviceCenterId: number,
    serviceId: number
): Promise<string[]> => {
    try {
        const response = await axios.get(
            `/api/QueueService.svc/json_pre_reg_https/GetDayList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}`
        );

        const data = response.data;

        if (data && Array.isArray(data.d)) {
            return data.d
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
    serviceCenterId: number,
    serviceId: number,
    date: string
): Promise<string[]> => {
    try {
        const formattedDate = reformatDate(date); // Перетворюємо дату у правильний формат перед запитом
        const response = await axios.get(
            `/api/QueueService.svc/json_pre_reg_https/GetTimeList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}&date=${formattedDate}`
        );

        const data = response.data;

        if (data && Array.isArray(data.d)) {
            return data.d
                .filter((time: PreRegTime) => time.IsAllow === 1)
                .map((time: PreRegTime) => parseTime(time.StartTime));
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
    const timestamp = parseInt(datePart.match(/\d+/)?.[0] || "0", 10);
    const date = new Date(timestamp);

    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
};

export const parseTime = (isoTime: string): string => {
    const match = isoTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
        const hours = match[1] ? match[1].padStart(2, "0") : "00";
        const minutes = match[2] ? match[2].padStart(2, "0") : "00";
        return `${hours}:${minutes}`;
    }
    return "Invalid time";
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
