import { useState } from "react";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <>
      <h3>Admin Panel</h3>

      <div className="btn-group mb-3">
        <button onClick={() => setTab("dashboard")} className="btn btn-primary">Dashboard</button>
        <button onClick={() => setTab("users")} className="btn btn-primary">Users</button>
        <button onClick={() => setTab("rooms")} className="btn btn-primary">Rooms</button>
        <button onClick={() => setTab("reports")} className="btn btn-primary">Reports</button>
      </div>

      {tab === "dashboard" && <div>Admin Stats</div>}
      {tab === "users" && <div>Create / Manage Users</div>}
      {tab === "rooms" && <div>Room Management</div>}
      {tab === "reports" && <div>Reports</div>}
    </>
  );
};

export default Admin;
