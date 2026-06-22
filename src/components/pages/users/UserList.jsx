import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaSearch,
  FaUsers,
  FaShieldAlt,
  FaUserTie,
  FaArrowUp,
  FaChevronRight,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteUserApi, getAllUsersAPi } from "../../services/userService";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const UserList = () => {
  const { isDarkGold } = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getAllUsersAPi();
      setUsers(response.users || []);
    } catch (err) {
      console.error("🔴 API Fetch Error:", err.response || err);

      if (err.response?.status === 401) {
        setError("❌ Unauthorized: Please login again.");
      } else if (err.response?.status === 403) {
        setError("❌ Access Denied: Admin privileges required.");
      } else if (!err.response) {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
        setError(
          `❌ Network Error: Cannot reach ${apiBase}. Is 'php artisan serve' running?`,
        );
      } else {
        setError(
          `❌ Database Error: ${err.response.data?.message || "Could not load users."}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchUsers, 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  useEffect(() => {
    let result = users;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserApi(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role !== "admin").length,
  };

  return (
    <div className="admin-dashboard-container">
      <style>{`
        .admin-dashboard-container {
          background: linear-gradient(135deg, var(--shop-bg) 0%, var(--shop-surface) 100%);
          color: var(--shop-text);
          min-height: 100vh;
          padding: 32px 24px;
        }

        /* Header Section */
        .dashboard-header {
          margin-bottom: 40px;
          animation: slideInDown 0.5s ease;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }

        .header-content h1 {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6, #ec4899, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          color: var(--shop-muted);
          font-size: 15px;
          margin: 0;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-refresh,
        .btn-add-user {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .btn-refresh {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border: 2px solid #3b82f6;
        }

        .btn-refresh:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
        }

        .btn-add-user {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .btn-add-user:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .btn-refresh.spinning svg {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 36px;
        }

        .stat-card {
          background: var(--shop-surface);
          border: 1px solid var(--shop-border);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #ec4899);
        }

        .stat-card:nth-child(2)::before {
          background: linear-gradient(90deg, #ef4444, #f97316);
        }

        .stat-card:nth-child(3)::before {
          background: linear-gradient(90deg, #10b981, #14b8a6);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--shop-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-number {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card:nth-child(2) .stat-number {
          background: linear-gradient(135deg, #ef4444, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card:nth-child(3) .stat-number {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-trend {
          font-size: 13px;
          color: #10b981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
        }

        .stat-card:nth-child(2) .stat-icon-box {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
          color: #ef4444;
        }

        .stat-card:nth-child(1) .stat-icon-box {
          color: #3b82f6;
        }

        .stat-card:nth-child(3) .stat-icon-box {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          color: #10b981;
        }

        /* Error Alert */
        .alert-box {
          background: rgba(239, 68, 68, 0.1);
          border-left: 4px solid #ef4444;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slideInDown 0.3s ease;
        }

        .alert-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .alert-message {
          flex: 1;
          color: var(--shop-text);
          font-size: 14px;
          line-height: 1.5;
        }

        .alert-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: var(--shop-muted);
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Search & Filter Bar */
        .search-filter-bar {
          display: flex;
          gap: 14px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--shop-muted);
          font-size: 16px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border: 2px solid var(--shop-border);
          border-radius: 10px;
          background: var(--shop-bg);
          color: var(--shop-text);
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: var(--shop-surface);
        }

        .filter-select {
          padding: 12px 14px;
          border: 2px solid var(--shop-border);
          border-radius: 10px;
          background: var(--shop-surface);
          color: var(--shop-text);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        /* Table Card */
        .table-card {
          background: var(--shop-surface);
          border: 1px solid var(--shop-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          animation: slideInUp 0.5s ease;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: linear-gradient(90deg, var(--shop-surface-2), var(--shop-surface));
          border-bottom: 2px solid var(--shop-border);
        }

        .users-table th {
          padding: 16px 14px;
          text-align: left;
          font-weight: 700;
          color: var(--shop-text);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .users-table tbody tr {
          border-bottom: 1px solid var(--shop-border);
          transition: all 0.2s ease;
        }

        .users-table tbody tr:hover {
          background-color: var(--shop-surface-2, rgba(0, 0, 0, 0.02));
        }

        .users-table td {
          padding: 14px;
        }

        .user-info-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid var(--shop-border);
        }

        .avatar-placeholder {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 700;
          color: var(--shop-text);
          margin: 0 0 2px 0;
          font-size: 14px;
        }

        .user-id {
          color: var(--shop-muted);
          font-size: 12px;
          margin: 0;
        }

        .email-cell {
          color: var(--shop-muted);
          font-size: 13px;
        }

        .role-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .role-admin {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.1));
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .role-user {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .date-cell {
          color: var(--shop-muted);
          font-size: 13px;
        }

        .actions-buttons {
          display: flex;
          gap: 8px;
        }

        .action-button {
          width: 38px;
          height: 38px;
          border: 1px solid var(--shop-border);
          border-radius: 8px;
          background: var(--shop-bg);
          color: var(--shop-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 15px;
        }

        .action-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        }

        .action-button.view {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .action-button.edit {
          color: #3b82f6;
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .action-button.delete {
          color: #ef4444;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .action-button.view:hover {
          background: rgba(16, 185, 129, 0.15);
        }

        .action-button.edit:hover {
          background: rgba(59, 130, 246, 0.15);
        }

        .action-button.delete:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        /* Empty State */
        .empty-state-box {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-emoji {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--shop-text);
          margin: 0 0 10px 0;
        }

        .empty-description {
          color: var(--shop-muted);
          font-size: 14px;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-dashboard-container {
            padding: 20px 16px;
          }

          .header-content h1 {
            font-size: 24px;
          }

          .header-wrapper {
            flex-direction: column;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .search-filter-bar {
            flex-direction: column;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .filter-select {
            min-width: 100%;
          }

          .users-table {
            font-size: 12px;
          }

          .users-table th,
          .users-table td {
            padding: 12px 8px;
          }

          .user-avatar {
            width: 36px;
            height: 36px;
          }

          .avatar-placeholder {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }

          .action-button {
            width: 34px;
            height: 34px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <div className="header-wrapper">
          <div className="header-content">
            <h1>User Management</h1>
            <p>Manage and monitor all system users with ease</p>
          </div>
          <div className="header-actions">
            <button
              className={`btn-refresh ${isLoading ? "spinning" : ""}`}
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <FaSyncAlt />
              Refresh
            </button>
            <Link className="btn-add-user" to="/admin/users/create">
              <FaPlus />
              Add User
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <h3 className="stat-number">{stats.total}</h3>
              <span className="stat-trend">
                <FaArrowUp /> 12% this month
              </span>
            </div>
            <div className="stat-icon-box">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Administrators</p>
              <h3 className="stat-number">{stats.admins}</h3>
              <span className="stat-trend">
                {stats.admins === 1 ? "1 Admin" : `${stats.admins} Admins`}
              </span>
            </div>
            <div className="stat-icon-box">
              <FaShieldAlt />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Regular Users</p>
              <h3 className="stat-number">{stats.regularUsers}</h3>
              <span className="stat-trend">Active members</span>
            </div>
            <div className="stat-icon-box">
              <FaUserTie />
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert-box">
          <span className="alert-icon">⚠️</span>
          <div className="alert-message">{error}</div>
          <button className="alert-close-btn" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin Only</option>
          <option value="user">Users Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-card">
        {isLoading ? (
          <LoadingSpinner message="Loading users..." />
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-emoji">
              {users.length === 0 ? "👥" : "🔍"}
            </div>
            <p className="empty-title">
              {users.length === 0 ? "No users yet" : "No results found"}
            </p>
            <p className="empty-description">
              {users.length === 0
                ? "Start by adding your first user to the system"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Member Since</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info-cell">
                        {user.image_url ? (
                          <img
                            src={user.image_url}
                            alt={user.name}
                            className="user-avatar"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="user-details">
                          <p className="user-name">{user.name}</p>
                          <p className="user-id">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="email-cell">{user.email}</span>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td>
                      <span className="date-cell">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "-"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-buttons">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="action-button view"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="action-button edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(user.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
