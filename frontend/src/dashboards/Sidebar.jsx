import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "220px" }}>
      <h5 className="mb-4">Hotel HMS</h5>

      {user?.Role === "ADMIN" && (
        <Link className="d-block text-white mb-2" to="/admin">Admin Panel</Link>
      )}

      {user?.Role === "MANAGER" && (
        <Link className="d-block text-white mb-2" to="/manager">Manager Panel</Link>
      )}

      {user?.Role === "RECEPTIONIST" && (
        <Link className="d-block text-white mb-2" to="/receptionist">Reception Panel</Link>
      )}

      {user?.Role === "HOUSEKEEPING" && (
        <Link className="d-block text-white mb-2" to="/housekeeping">Housekeeping Panel</Link>
      )}

      {user?.Role === "GUEST" && (
        <Link className="d-block text-white mb-2" to="/guest">Guest Panel</Link>
      )}
    </div>
  );
};

export default Sidebar;
