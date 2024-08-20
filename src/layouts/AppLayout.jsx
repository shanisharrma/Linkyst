import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>

      <div className="p-6 text-center bg-gray-800 mt-10">
        Made with 💖 by Shani Sharma
      </div>
    </div>
  );
};

export default AppLayout;
