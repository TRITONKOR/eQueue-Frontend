import React, { createContext, ReactNode, useContext, useState } from "react";

type AdminAuthContextType = {
    isAdmin: boolean;
    loginAsAdmin: () => void;
    logoutAdmin: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const loginAsAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    return (
        <AdminAuthContext.Provider
            value={{ isAdmin, loginAsAdmin, logoutAdmin }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = (): AdminAuthContextType => {
    const context = useContext(AdminAuthContext);
    if (!context)
        throw new Error("useAdminAuth must be used within AdminAuthProvider");
    return context;
};
