import { Button } from "@heroui/button";
import React from "react";
import { useNavigate } from "react-router";
import "./greetingPage.scss";

const GreetingPage: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/profile");
    };

    return (
        <div className="container">
            <h1>Вас вітає Центр надання адміністративних послуг!</h1>
            <div>
                <strong>
                    Шановний відвідувачу, даний сервіс дозволяє Вам здійснити
                    попередній запис на прийом до адміністратора ЦНАП.
                </strong>
                <p>
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
            <Button color="primary" onPress={handleClick}>
                Заповнити анкету
            </Button>
        </div>
    );
};

export default GreetingPage;
