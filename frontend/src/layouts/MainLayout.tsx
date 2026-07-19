// Shared authenticated page shell used by current and future workspace pages.
import type { ReactNode } from 'react';

import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-shell__body">
        <Sidebar />
        <div className="app-shell__content">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};
