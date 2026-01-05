import React from "react";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div>
      {/* Optional: you can use a separate dashboard navbar */}
      <Navbar scrolled={true} />

      <main style={{ paddingTop: "80px" }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
