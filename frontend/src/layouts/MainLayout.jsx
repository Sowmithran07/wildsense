import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import LiveEmergencyModal from '../components/alerts/LiveEmergencyModal';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 selection:bg-emerald-500 selection:text-obsidian-950">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (if logged in) */}
        {isAuthenticated && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Content Outlet */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isAuthenticated ? 'lg:pl-64' : ''
          } p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full`}
        >
          <Outlet />
        </main>
      </div>

      {/* Real-Time Emergency Modal */}
      <LiveEmergencyModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
