import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext";
import { ServiceCenterProvider } from "./context/ServiceCenterContext";
import { ServiceProvider } from "./context/ServiceContext";
import { UserProvider } from "./context/UserContext";
import GreetingPage from "./pages/GreetingPage/GreetingPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ReceiptPage } from "./pages/ReceiptPage/ReceiptPage";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage";
import { ServiceCentersPage } from "./pages/ServiceCentersPage/ServiceCentersPage";
import { ServicesPage } from "./pages/ServicesPage/ServicesPage";
function App() {
    return (
        <UserProvider>
            <ServiceCenterProvider>
                <ServiceProvider>
                    <ReceiptProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<GreetingPage />} />
                                <Route
                                    path="profile"
                                    element={<ProfilePage />}
                                />
                                <Route
                                    path="serviceCenters"
                                    element={<ServiceCentersPage />}
                                />
                                <Route
                                    path="servicesAndGroups"
                                    element={<ServicesPage />}
                                />
                                <Route
                                    path="services"
                                    element={<RegistrationPage />}
                                />
                                <Route
                                    path="receipt"
                                    element={<ReceiptPage />}
                                />
                                <Route path="*" element={<div>404</div>} />
                            </Routes>
                        </BrowserRouter>
                    </ReceiptProvider>
                </ServiceProvider>
            </ServiceCenterProvider>
        </UserProvider>
    );
}

export default App;
