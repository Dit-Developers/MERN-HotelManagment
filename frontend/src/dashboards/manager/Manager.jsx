import { useState } from "react";

const Manager = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <>
      <h3>Manager Dashboard</h3>

      <div className="btn-group mb-4">
        <button className="btn btn-outline-success" onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className="btn btn-outline-success" onClick={() => setTab("bookings")}>Bookings</button>
        <button className="btn btn-outline-success" onClick={() => setTab("revenue")}>Revenue</button>
      </div>

      {tab === "dashboard" && (
        <div className="row">
          <div className="col-md-4"><div className="card p-3">Today Bookings</div></div>
          <div className="col-md-4"><div className="card p-3">Monthly Revenue</div></div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="card p-3">
          <h5>All Bookings</h5>
          <p>View reservations only</p>
        </div>
      )}

      {tab === "revenue" && (
        <div className="card p-3">
          <h5>Revenue Report</h5>
          <p>Daily / Monthly revenue</p>
        </div>
      )}
    </>
  );
};

export default Manager;
