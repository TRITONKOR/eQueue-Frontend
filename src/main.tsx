import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GreetingLayout } from "./layouts/GreetingLayout.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GreetingLayout />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
