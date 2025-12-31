import { useState } from "react";

const Guest = () => {
  const [tab, setTab] = useState("booking");

  return (
    <>
      <h3>Guest Dashboard</h3>

      <div className="btn-group mb-4">
        <button className="btn btn-outline-info" onClick={() => setTab("booking")}>My Booking</button>
        <button className="btn btn-outline-info" onClick={() => setTab("services")}>Services</button>
        <button className="btn btn-outline-info" onClick={() => setTab("feedback")}>Feedback</button>
      </div>

      {tab === "booking" && (
        <div className="card p-3">
          <h5>My Bookings</h5>
          <p>No bookings yet</p>
        </div>
      )}

      {tab === "services" && (
        <div className="card p-3">
          <h5>Request Service</h5>
          <button className="btn btn-info">Request</button>
        </div>
      )}

      {tab === "feedback" && (
        <div className="card p-3">
          <h5>Feedback</h5>
          <textarea className="form-control mb-2"></textarea>
          <button className="btn btn-info">Submit</button>
        </div>
      )}
    </>
  );
};

export default Guest;
