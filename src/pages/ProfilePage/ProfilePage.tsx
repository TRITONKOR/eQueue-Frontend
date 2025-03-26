import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./profilePage.scss";

export const ProfilePage: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
        agreement: false,
    });

    useEffect(() => {
        setFormData({
            lastName: userProfile.lastName || "",
            firstName: userProfile.firstName || "",
            middleName: userProfile.middleName || "",
            phone: userProfile.phone || "",
            email: userProfile.email || "",
            companyName: userProfile.companyName || "",
            agreement: false,
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

        if (name !== "agreement") {
            setUserProfile({
                ...userProfile,
                [name]: updatedValue,
            });
        }
    };

    const isFormValid =
        formData.lastName.trim() !== "" &&
        formData.firstName.trim() !== "" &&
        formData.middleName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.agreement;

    return (
        <div className="container flex flex-col items-center justify-center mx-auto p-6 bg-white shadow-lg rounded-lg max-w-full sm:max-w-4xl sm:my-auto">
            <h1 className="h1-primary">Анкета відвідувача</h1>
            <form className="flex flex-col w-full sm:w-auto">
                <div className="form-group mb-4">
                    <label
                        htmlFor="lastName"
                        className="block text-sm sm:text-base mb-2"
                    >
                        Прізвище*
                    </label>
                    <Input
                        id="lastName"
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        isRequired
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        value={formData.lastName}
                        size="lg"
                    />
                </div>
                <div className="form-group mb-4">
                    <label
                        htmlFor="firstName"
                        className="block text-sm sm:text-base mb-2"
                    >
                        Ім'я*
                    </label>
                    <Input
                        id="firstName"
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        isRequired
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        value={formData.firstName}
                        size="lg"
                    />
                </div>
                <div className="form-group mb-4">
                    <label
                        htmlFor="middleName"
                        className="block text-sm sm:text-base mb-2"
                    >
                        По батькові*
                    </label>
                    <Input
                        id="middleName"
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        isRequired
                        type="text"
                        name="middleName"
                        onChange={handleChange}
                        value={formData.middleName}
                        size="lg"
                    />
                </div>
                <div className="form-group mb-4">
                    <label
                        htmlFor="companyName"
                        className="block text-sm sm:text-base mb-2"
                    >
                        Назва юридичної особи
                    </label>
                    <Input
                        id="companyName"
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        type="text"
                        name="companyName"
                        onChange={handleChange}
                        value={formData.companyName}
                        size="lg"
                    />
                </div>
                <div className="form-group mb-4">
                    <label
                        htmlFor="phone"
                        className="block text-sm sm:text-base mb-2"
                    >
                        Номер телефону*
                    </label>
                    <Input
                        id="phone"
                        isRequired
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        type="tel"
                        name="phone"
                        onChange={handleChange}
                        value={formData.phone}
                        size="lg"
                    />
                </div>
                <div className="form-group mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm sm:text-base mb-2"
                    >
                        E-mail
                    </label>
                    <Input
                        id="email"
                        className="form-control"
                        classNames={{ input: " text-lg" }}
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        size="lg"
                    />
                </div>

                <div className="form-group mb-2">
                    <Checkbox
                        id="agreement"
                        name="agreement"
                        classNames={{ label: "text-sm sm:text-lg" }}
                        isRequired
                        onChange={handleChange}
                        checked={formData.agreement}
                    >
                        Відповідно до ст. 11 Закону України «Про захист
                        персональних даних» надаю згоду на обробку та
                        використання моїх даних для здійснення повноважень,
                        пов'язаних із розглядом даного запиту
                    </Checkbox>
                </div>

                <div className="flex justify-center sm:gap-2 flex-wrap">
                    <Button
                        className="btn-primary  sm:w-auto order-2 sm:order-1"
                        color="primary"
                        onPress={() => navigate("/")}
                    >
                        Повернутися назад
                    </Button>
                    <Button
                        className="btn-primary  sm:w-auto order-1 sm:order-2"
                        color="primary"
                        isDisabled={!isFormValid}
                        onPress={() => navigate("/serviceCenters")}
                    >
                        Продовжити
                    </Button>
                </div>
            </form>
        </div>
    );
};
