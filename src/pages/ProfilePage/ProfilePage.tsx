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
        <div className="container-primary max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-10">
                <h1 className="h1-primary mb-4">Анкета відвідувача</h1>
                <p className="text-gray-600">
                    Будь ласка, заповніть обов'язкові поля (позначені{" "}
                    <span className="text-red-500">*</span>) для продовження
                </p>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                                Прізвище<span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="lastName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                value={formData.lastName}
                                size="lg"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                                Ім'я<span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="firstName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="firstName"
                                onChange={handleChange}
                                value={formData.firstName}
                                size="lg"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="middleName" className="form-label">
                                По батькові
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="middleName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="middleName"
                                onChange={handleChange}
                                value={formData.middleName}
                                size="lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Номер телефону
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="phone"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="tel"
                                name="phone"
                                onChange={handleChange}
                                value={formData.phone}
                                size="lg"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                E-mail
                            </label>
                            <Input
                                id="email"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                size="lg"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="companyName" className="form-label">
                                Назва юридичної особи
                            </label>
                            <Input
                                id="companyName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                type="text"
                                name="companyName"
                                onChange={handleChange}
                                value={formData.companyName}
                                size="lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mt-6">
                    <Checkbox
                        id="agreement"
                        name="agreement"
                        classNames={{
                            base: "items-start",
                            wrapper: "mt-1",
                            label: "text-sm sm:text-base text-gray-700",
                        }}
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

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                    <Button
                        className="btn-primary px-8 py-3 order-2 sm:order-1"
                        color="primary"
                        onPress={() => navigate("/")}
                    >
                        ← Повернутися назад
                    </Button>
                    <Button
                        className="btn-primary px-8 py-3 order-1 sm:order-2"
                        color="primary"
                        isDisabled={!isFormValid}
                        onPress={() => navigate("/serviceCenters")}
                    >
                        Продовжити →
                    </Button>
                </div>
            </form>
        </div>
    );
};
