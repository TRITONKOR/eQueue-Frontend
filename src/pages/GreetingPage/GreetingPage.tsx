import { Button } from "@heroui/button";
import React from "react";
import { useNavigate } from "react-router";

const GreetingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container-primary">
            <h1 className="h1-primary">
                Вас вітає Центр надання адміністративних послуг!
            </h1>
            <div className="mb-6">
                <strong className="text-lg sm:text-xl text-gray-700 block mb-4">
                    Шановний відвідувачу, даний сервіс дозволяє Вам здійснити
                    попередній запис на прийом до адміністратора ЦНАП.
                </strong>
                <p className="text-base sm:text-lg text-gray-600">
                    Просимо врахувати, що попередній запис у ЦНАП можна
                    здійснити лише один раз на одну послугу протягом робочого
                    дня і окремо на видачу документів. Після здійснення
                    реєстрації, роздрукуйте інформацію про запис (номер в
                    електронній черзі, дату, час прийому та назву послуги) та
                    надайте його адміністратору під час обслуговування. Візьміть
                    з собою паспорт та доручення (у разі представлення інтересів
                    іншої особи). Рекомендуємо Вам завчасно прийти в Центр та
                    слідкувати за викликом на моніторах електронної черги.
                </p>
            </div>
            <div className="flex w-full justify-center">
                <Button
                    className="btn-primary sm:w-auto"
                    color="primary"
                    onPress={() => navigate("/profile")}
                >
                    Заповнити анкету
                </Button>
            </div>
        </div>
    );
};

export default GreetingPage;
