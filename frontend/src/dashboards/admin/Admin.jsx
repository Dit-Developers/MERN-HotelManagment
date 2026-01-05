import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3900";

const Admin = () => {
  const [tab, setTab] = useState("dashboard");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* =======================
     DASHBOARD STATS
  ======================= */
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    revenue: 0,
  });

  const loadStats = async () => {
    try {
      const users = await axios.get(`${API_BASE}/users`, authHeader);
      const rooms = await axios.get(`${API_BASE}/rooms`, authHeader);
      const payments = await axios.get(`${API_BASE}/payments`, authHeader);

      const revenue = payments.data.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      setStats({
        users: users.data.length,
        rooms: rooms.data.length,
        revenue,
      });
    } catch (err) {
      console.error("Stats error", err);
    }
  };

  /* =======================
     USERS CRUD
  ======================= */
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    Role: "admin",
    Phone: "",
    Address: "",
  });

  const loadUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`, authHeader);
    setUsers(res.data);
  };

  const createUser = async () => {
    await axios.post(`${API_BASE}/users/Register`, userForm, authHeader);
    setUserForm({
      Name: "",
      Email: "",
      Password: "",
      Role: "admin",
      Phone: "",
      Address: "",
    });
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API_BASE}/users/Delete/${id}`, authHeader);
    loadUsers();
  };

  /* =======================
     ROOMS CRUD
  ======================= */
  const [rooms, setRooms] = useState([]);
  const [roomForm, setRoomForm] = useState({
    type: "",
    price: "",
    status: "available",
  });

  const loadRooms = async () => {
    const res = await axios.get(`${API_BASE}/rooms`, authHeader);
    setRooms(res.data);
  };

  const createRoom = async () => {
    await axios.post(`${API_BASE}/rooms`, roomForm, authHeader);
    setRoomForm({ type: "", price: "", status: "available" });
    loadRooms();
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    await axios.delete(`${API_BASE}/rooms/${id}`, authHeader);
    loadRooms();
  };

  /* =======================
     INITIAL LOAD
  ======================= */
  useEffect(() => {
    loadStats();
    loadUsers();
    loadRooms();
  }, []);

  return (
    <>
      <h3 className="mb-4">Admin Dashboard</h3>

      {/* Tabs */}
      <div className="btn-group mb-4">
        <button className="btn btn-outline-primary" onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className="btn btn-outline-primary" onClick={() => setTab("users")}>Users</button>
        <button className="btn btn-outline-primary" onClick={() => setTab("rooms")}>Rooms</button>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div className="row">
          <div className="col-md-4">
            <div className="card p-3">Total Users: {stats.users}</div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">Total Rooms: {stats.rooms}</div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">Revenue: {stats.revenue}</div>
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === "users" && (
        <div className="card p-3">
          <h5>Create User</h5>

          <input className="form-control mb-2" placeholder="Name"
            value={userForm.Name}
            onChange={(e) => setUserForm({ ...userForm, Name: e.target.value })}
          />

          <input className="form-control mb-2" placeholder="Email"
            value={userForm.Email}
            onChange={(e) => setUserForm({ ...userForm, Email: e.target.value })}
          />

          <input className="form-control mb-2" placeholder="Password"
            type="password"
            value={userForm.Password}
            onChange={(e) => setUserForm({ ...userForm, Password: e.target.value })}
          />

          <select className="form-control mb-2"
            value={userForm.Role}
            onChange={(e) => setUserForm({ ...userForm, Role: e.target.value })}
          >
            <option value="admin">ADMIN</option>
            <option value="manager">MANAGER</option>
            <option value="receptionist">RECEPTIONIST</option>
            <option value="housekeeping">HOUSEKEEPING</option>
          </select>

          <button className="btn btn-primary mb-4" onClick={createUser}>Create User</button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.Name}</td>
                  <td>{u.Email}</td>
                  <td>{u.Role}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ROOMS */}
      {tab === "rooms" && (
        <div className="card p-3">
          <h5>Add Room</h5>

          <input className="form-control mb-2" placeholder="Room Type"
            value={roomForm.type}
            onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
          />

          <input className="form-control mb-2" placeholder="Price"
            value={roomForm.price}
            onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
          />

          <button className="btn btn-primary mb-4" onClick={createRoom}>Add Room</button>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Type</th><th>Price</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id}>
                  <td>{r.type}</td>
                  <td>{r.price}</td>
                  <td>{r.status}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteRoom(r._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Admin;
