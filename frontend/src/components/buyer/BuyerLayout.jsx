import React from 'react';
import { BuyerSidebar } from './BuyerSidebar';
import { BuyerHeader } from './BuyerHeader';

/**
 * BuyerLayout — desktop: fixed sidebar + scrollable content
 *              tablet: collapsible sidebar (overlay)
 *              mobile: header with hamburger
 */
export const BuyerLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#070A12]">
      {/* Sidebar (fixed on desktop, overlay on mobile/tablet) */}
      <BuyerSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <BuyerHeader />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
