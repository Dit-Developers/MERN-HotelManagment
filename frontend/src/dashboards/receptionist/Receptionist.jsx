import { useState } from "react";

const Receptionist = () => {
  const [tab, setTab] = useState("guests");

  return (
    <>
      <h3>Receptionist Panel</h3>

      <div className="btn-group mb-4">
        <button className="btn btn-outline-warning" onClick={() => setTab("guests")}>Guests</button>
        <button className="btn btn-outline-warning" onClick={() => setTab("reservations")}>Reservations</button>
        <button className="btn btn-outline-warning" onClick={() => setTab("billing")}>Billing</button>
      </div>

      {tab === "guests" && (
        <div className="card p-3">
          <h5>Add Guest</h5>
          <input className="form-control mb-2" placeholder="Guest Name" />
          <input className="form-control mb-2" placeholder="CNIC / ID" />
          <button className="btn btn-warning">Save Guest</button>
        </div>
      )}

      {tab === "reservations" && (
        <div className="card p-3">
          <h5>Book Room</h5>
          <input className="form-control mb-2" placeholder="Room Type" />
          <input className="form-control mb-2" type="date" />
          <button className="btn btn-warning">Book</button>
        </div>
      )}

      {tab === "billing" && (
        <div className="card p-3">
          <h5>Generate Bill</h5>
          <button className="btn btn-warning">Generate Invoice</button>
        </div>
      )}
    </>
  );
};

export default Receptionist;
