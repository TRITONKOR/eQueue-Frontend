import { createContext, ReactNode, useContext, useState } from "react";

interface ReceiptData {
    CustOrderGuid: string;
    CustReceiptNum: number;
    selectedDate: string;
    selectedTime: string;
}

const defaultReceipt: ReceiptData = {
    CustOrderGuid: "",
    CustReceiptNum: 0,
    selectedDate: "",
    selectedTime: "",
};

const ReceiptContext = createContext<{
    receipt: ReceiptData;
    setReceipt: (data: ReceiptData) => void;
}>({
    receipt: defaultReceipt,
    setReceipt: () => {},
});

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
    const [receipt, setReceipt] = useState<ReceiptData>(defaultReceipt);

    return (
        <ReceiptContext.Provider value={{ receipt, setReceipt }}>
            {children}
        </ReceiptContext.Provider>
    );
};

export const useReceipt = () => useContext(ReceiptContext);
