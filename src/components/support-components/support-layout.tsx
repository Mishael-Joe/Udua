// support-layout.tsx
// Main layout for the support page, styled with Tailwind CSS for consistent page structure.

import { ReactNode } from "react";

interface SupportLayoutProps {
  children: ReactNode; // Accepts any child components passed to it
}

const SupportLayout = ({ children }: SupportLayoutProps) => {
  return (
    <div className="support-page min-h-screen flex flex-col max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="py-6 px-4 text-center">
        {/* <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Udua Support Center
        </h1> */}

        <h2 className="text-lg md:text-2xl font-semibold mb-4">
          Welcome to Udua Support
        </h2>
        <p className="text-lg text-gray-600">
          Here you'll find answers to your questions, and if you need further
          assistance, feel free to contact us.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-10 px-4">{children}</main>
    </div>
  );
};

export default SupportLayout;
