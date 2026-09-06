import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { SpatialNav } from '../components/SpatialNav';
import { useState } from 'react';

export const DashboardLayout: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="app-frame">
      <SpatialNav open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="app-content">
        <Header onMenu={() => setNavOpen(true)} />
        <main className="route-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
