import { useState } from "react";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <>
      <h3>Admin Dashboard</h3>

      <div className="btn-group mb-4">
        <button className="btn btn-outline-primary" onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className="btn btn-outline-primary" onClick={() => setTab("users")}>Users</button>
        <button className="btn btn-outline-primary" onClick={() => setTab("rooms")}>Rooms</button>
        <button className="btn btn-outline-primary" onClick={() => setTab("reports")}>Reports</button>
      </div>

      {tab === "dashboard" && (
        <div className="row">
          <div className="col-md-3"><div className="card p-3">Total Rooms</div></div>
          <div className="col-md-3"><div className="card p-3">Total Users</div></div>
          <div className="col-md-3"><div className="card p-3">Revenue</div></div>
        </div>
      )}

      {tab === "users" && (
        <div className="card p-3">
          <h5>Create User</h5>
          <input className="form-control mb-2" placeholder="Name" />
          <input className="form-control mb-2" placeholder="Email" />
          <select className="form-control mb-2">
            <option>ADMIN</option>
            <option>MANAGER</option>
            <option>RECEPTIONIST</option>
            <option>HOUSEKEEPING</option>
          </select>
          <button className="btn btn-primary">Create</button>
        </div>
      )}

      {tab === "rooms" && (
        <div className="card p-3">
          <h5>Room Management</h5>
          <input className="form-control mb-2" placeholder="Room Type" />
          <input className="form-control mb-2" placeholder="Price" />
          <button className="btn btn-primary">Add Room</button>
        </div>
      )}

      {tab === "reports" && (
        <div className="card p-3">
          <h5>Reports</h5>
          <p>Occupancy, Revenue & Room Status</p>
        </div>
      )}
    </>
  );
};

export default Admin;
