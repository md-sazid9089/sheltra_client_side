import { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getUserRole } from '../utils/tokenUtils';
import { getMenuItemsByRole } from '../config/menuConfig';

/**
 * AppShell layout component with Topbar and Sidebar
 * Provides the main layout structure for all protected routes
 */
export default function AppShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userRole = getUserRole();
    const menuItems = getMenuItemsByRole(userRole);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} menuItems={menuItems} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto pt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
