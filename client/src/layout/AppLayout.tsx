import { NavLink, Outlet } from "react-router-dom";

const links = [{ to: "/teams", label: "Equipos" }];

export function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-slate-800">
                <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
                    <span className="font-bold tracking-tight">🏀 NBA Tracker</span>
                    {links.map(({ to, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `text-sm ${isActive ? "text-white" : "text-slate-400 hover:text-slate-200"}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}