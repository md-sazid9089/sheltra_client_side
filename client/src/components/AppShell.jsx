import { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getUserRole } from '../utils/tokenUtils';
import { getMenuItemsByRole } from '../config/menuConfig';

/**
 * AppShell layout component with modern glassmorphism design
 * Capsule-style topbar with responsive sidebar
 */
export default function AppShell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userRole = getUserRole();
    const menuItems = getMenuItemsByRole(userRole);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Modern Topbar */}
            <Topbar 
                onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
                menuItems={menuItems}
                sidebarOpen={sidebarOpen}
            />

            {/* Mobile Sidebar */}
            <Sidebar 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
                menuItems={menuItems} 
            />

            {/* Main Content */}
            <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
