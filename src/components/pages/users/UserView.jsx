import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserByIdApi } from "../../services/userService";
import { extractResource } from "../../services/apiHelpers";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const UserView = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByIdApi(id);
        setUser(extractResource(response, "user"));
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Could not load this user.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading user details..." />;
  }

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>User Details</h2>
          <p>View database profile information.</p>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-outline-secondary" to="/admin/users">
            Back
          </Link>
          {user && (
            <Link
              className="btn btn-primary"
              to={`/admin/users/${user.id}/edit`}
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {user && (
        <div className="admin-crud-card overflow-hidden">
          {/* Cover Banner */}
          <div
            style={{
              height: "120px",
              background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
              position: "relative",
            }}
          />

          {/* User Profile Header */}
          <div
            className="px-4 pb-4 d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3"
            style={{
              marginTop: "-50px",
              marginBottom: "20px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {user.image_url ? (
              <img
                className="shadow border border-4 border-white rounded-circle"
                src={user.image_url}
                alt={user.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  background: "#f8fafc",
                }}
              />
            ) : (
              <div
                className="shadow border border-4 border-white rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <i className="bi bi-person" />
                )}
              </div>
            )}
            <div className="text-center text-md-start mb-1">
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                {user.name}
              </h3>
              <p className="text-muted mb-0 small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <i className="bi bi-envelope"></i> {user.email}
                <span
                  className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}
                  style={{ fontSize: "11px" }}
                >
                  {user.role || "user"}
                </span>
              </p>
            </div>
          </div>

          <div className="p-4 pt-0">
            <dl className="admin-detail-list">
              <div>
                <dt>User ID</dt>
                <dd>#{user.id}</dd>
              </div>
              <div>
                <dt>Full Name</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt>Email Address</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>System Role</dt>
                <dd>
                  <span
                    className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    {user.role || "user"}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;
