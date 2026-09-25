import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/layout/AppLayout";
import { Teams } from "@/pages/Teams";
import { TeamDetail } from "@/pages/TeamDetail";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<Navigate to="/teams" replace />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/teams/:teamId" element={<TeamDetail />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
