import { Button } from "@heroui/button";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminAuthPage: React.FC = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loginAsAdmin } = useAdminAuth();

    const handleLogin = async () => {
        try {
            await axios.post("/api/login", {
                login,
                password,
            });
            loginAsAdmin();
            navigate("/admin");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Невірний логін або пароль");
        }
    };

    return (
        <div className="container-primary max-w-md mx-auto px-4 sm:px-6 py-12">
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Вхід до адмін-панелі
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label
                        htmlFor="login"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Логін
                    </label>
                    <input
                        type="text"
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введіть логін"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Пароль
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введіть пароль"
                    />
                </div>

                <Button
                    className="btn-primary w-full text-lg"
                    color="primary"
                    onPress={handleLogin}
                >
                    Увійти
                </Button>
            </div>
        </div>
    );
};

export default AdminAuthPage;
