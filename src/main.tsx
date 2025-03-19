import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GreetingLayout } from "./layouts/GreetingLayout.tsx";
import { ProfileLayout } from "./layouts/ProfileLayout.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GreetingLayout />} />
                <Route path="profile" element={<ProfileLayout />} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
