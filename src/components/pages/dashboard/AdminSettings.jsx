import React, { useState } from "react";
import "../adminCrud.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("ecommerce_admin_settings");
    return saved
      ? JSON.parse(saved)
      : {
          storeName: "E-Shop Premium Catalogue",
          contactEmail: "admin@eshop.com",
          currency: "USD",
          sandboxMode: true,
          maintenanceMode: false,
        };
  });

  const [alert, setAlert] = useState({ show: false, message: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("ecommerce_admin_settings", JSON.stringify(settings));
    setAlert({ show: true, message: "Admin system configurations saved successfully!" });
    setTimeout(() => {
      setAlert({ show: false, message: "" });
    }, 3000);
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>System Settings</h2>
          <p>Configure general shop information, payment gateways, and maintenance parameters.</p>
        </div>
      </div>

      {alert.show && (
        <div className="alert alert-success shadow-sm rounded-3 mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill"></i>
          <strong>{alert.message}</strong>
        </div>
      )}

      <div className="admin-crud-card p-4 p-md-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* General Configurations */}
            <div className="col-12 col-md-6">
              <h5 className="fw-bold text-dark mb-3">General Details</h5>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Store Brand Name</label>
                <input
                  type="text"
                  name="storeName"
                  className="form-control"
                  value={settings.storeName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Support Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-control"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Default Shop Currency</label>
                <select
                  name="currency"
                  className="form-select"
                  value={settings.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Gateway & Infrastructure configurations */}
            <div className="col-12 col-md-6">
              <h5 className="fw-bold text-dark mb-3">Gateway & Operations</h5>
              
              <div className="p-3 bg-light rounded-3 mb-3 border border-light">
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                  <div>
                    <label className="form-check-label fw-bold text-dark mb-1" htmlFor="sandboxSwitch">
                      Payment Sandbox Mode
                    </label>
                    <p className="text-secondary small mb-0">Simulate credit card checkouts without real processor connections.</p>
                  </div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="sandboxSwitch"
                    name="sandboxMode"
                    style={{ width: "45px", height: "22px", cursor: "pointer" }}
                    checked={settings.sandboxMode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border border-light">
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                  <div>
                    <label className="form-check-label fw-bold text-dark mb-1" htmlFor="maintenanceSwitch">
                      Maintenance Status
                    </label>
                    <p className="text-secondary small mb-0">Disable customer checkout capabilities temporarily.</p>
                  </div>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="maintenanceSwitch"
                    name="maintenanceMode"
                    style={{ width: "45px", height: "22px", cursor: "pointer" }}
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-end border-top pt-4">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 fw-semibold"
              style={{
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                border: "none",
              }}
            >
              Save Configurations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
