import { useState } from "react";

const Housekeeping = () => {
  const [tab, setTab] = useState("cleaning");

  return (
    <>
      <h3>Housekeeping Panel</h3>

      <div className="btn-group mb-4">
        <button className="btn btn-outline-secondary" onClick={() => setTab("cleaning")}>Cleaning</button>
        <button className="btn btn-outline-secondary" onClick={() => setTab("maintenance")}>Maintenance</button>
      </div>

      {tab === "cleaning" && (
        <div className="card p-3">
          <h5>Assigned Rooms</h5>
          <p>Room 101 - Pending</p>
          <button className="btn btn-secondary">Mark Clean</button>
        </div>
      )}

      {tab === "maintenance" && (
        <div className="card p-3">
          <h5>Maintenance Request</h5>
          <textarea className="form-control mb-2" placeholder="Issue"></textarea>
          <button className="btn btn-secondary">Report</button>
        </div>
      )}
    </>
  );
};

export default Housekeeping;
