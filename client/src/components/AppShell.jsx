import { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getUserRole } from '../utils/tokenUtils';
import { getMenuItemsByRole } from '../config/menuConfig';

/**
 * AppShell – dark sidebar + topbar layout shell.
 * Desktop: w-64 sidebar | Tablet: w-16 icon sidebar | Mobile: hamburger overlay.
 * All inner pages inherit this shell automatically.
 */
export default function AppShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userRole = getUserRole();
    const menuItems = getMenuItemsByRole(userRole);

    return (
        <div className="min-h-screen" style={{ background: '#0b1120' }}>
            {/* Sidebar (fixed, handles its own responsive variants) */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                menuItems={menuItems}
            />

            {/* Content wrapper — offset by sidebar width */}
            <div className="md:ml-16 lg:ml-64 flex flex-col min-h-screen">
                {/* Topbar (sticky inside content column) */}
                <Topbar
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    menuItems={menuItems}
                />

                {/* Main content */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
