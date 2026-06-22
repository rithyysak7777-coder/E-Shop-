import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../api/axios";

const Settings = () => {
  const { user, token, HandleLogin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
    }
  }, [user, token, navigate]);

  // Load fresh profile from API when available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        const serverUser = res.data.user;
        if (serverUser) {
          setProfileForm((prev) => ({
            ...prev,
            name: serverUser.name || prev.name,
            email: serverUser.email || prev.email,
            phone: serverUser.phone || prev.phone,
            address: serverUser.address || prev.address,
            city: serverUser.city || prev.city,
          }));
          if (serverUser.image_url) setAvatarPreview(serverUser.image_url);
          // sync auth context
          HandleLogin(serverUser, token);
        }
      } catch (err) {
        console.warn("Could not fetch profile:", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // Tab Control
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: localStorage.getItem("ecommerce_shipping_phone") || "",
    address: localStorage.getItem("ecommerce_shipping_address") || "",
    city: localStorage.getItem("ecommerce_shipping_city") || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(() => {
    return localStorage.getItem("ecommerce_avatar") || user?.avatar_url || "";
  });
  const [avatarFile, setAvatarFile] = useState(null);

  // Saved Payment Form State
  const [paymentForm, setPaymentForm] = useState(() => {
    const saved = localStorage.getItem("ecommerce_saved_payment");
    return saved
      ? JSON.parse(saved)
      : {
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        };
  });

  // Preferences State
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("ecommerce_preferences");
    return saved
      ? JSON.parse(saved)
      : {
          currency: "USD",
          darkMode: false,
          emailAlerts: true,
        };
  });

  // Alerts
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const triggerAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    setAvatarPreview(url);
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handlePrefChange = (name, value) => {
    const nextPrefs = { ...preferences, [name]: value };
    setPreferences(nextPrefs);
    localStorage.setItem("ecommerce_preferences", JSON.stringify(nextPrefs));

    if (name === "darkMode") {
      if (value) {
        document.body.classList.add("dark-theme");
      } else {
        document.body.classList.remove("dark-theme");
      }
    }
  };

  const saveProfile = (e) => {
    e.preventDefault();

    // 1. Update shipping defaults
    localStorage.setItem("ecommerce_shipping_phone", profileForm.phone);
    localStorage.setItem("ecommerce_shipping_address", profileForm.address);
    localStorage.setItem("ecommerce_shipping_city", profileForm.city);

    // 2. Update user name in Auth context and user profile
    const submitUpdate = async () => {
      try {
        let res;
        if (avatarFile) {
          const formData = new FormData();
          formData.append("name", profileForm.name);
          formData.append("phone", profileForm.phone || "");
          formData.append("address", profileForm.address || "");
          formData.append("city", profileForm.city || "");
          formData.append("image", avatarFile);

          res = await api.put("/user/profile", formData);
        } else {
          res = await api.put("/user/profile", {
            name: profileForm.name,
            phone: profileForm.phone,
            address: profileForm.address,
            city: profileForm.city,
          });
        }

        if (res && res.data && res.data.user) {
          const serverUser = res.data.user;
          HandleLogin(serverUser, token);
          setAvatarPreview(serverUser.image_url || avatarPreview);
          triggerAlert("Profile updated on server", "success");
        }
      } catch (err) {
        console.error("Profile update failed:", err);
        triggerAlert("Could not save profile. Please try again.", "danger");
      }
    };

    submitUpdate();
    triggerAlert("Profile settings successfully updated!");
  };

  const savePayment = (e) => {
    e.preventDefault();

    // Validation
    if (
      paymentForm.cardNumber &&
      paymentForm.cardNumber.replace(/\s/g, "").length < 16
    ) {
      triggerAlert("Please enter a valid 16-digit card number", "danger");
      return;
    }

    localStorage.setItem(
      "ecommerce_saved_payment",
      JSON.stringify(paymentForm),
    );
    triggerAlert("Payment details saved securely!");
  };

  if (!user) return null;

  return (
    <div className="container py-5">
      {alert.show && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show shadow rounded-3 mb-4`}
          role="alert"
        >
          <i
            className={`bi ${alert.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}
          ></i>
          <strong>{alert.message}</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert({ show: false })}
          ></button>
        </div>
      )}

      <div className="row g-4">
        {/* Navigation Sidebar */}
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h5 className="fw-bold text-dark px-3 py-2 mb-3">Settings</h5>
            <div className="nav flex-column nav-pills gap-2">
              <button
                className={`nav-link text-start py-2.5 px-3 rounded-3 fw-semibold ${
                  activeTab === "profile"
                    ? "active bg-primary text-white"
                    : "text-secondary hover-bg-light"
                }`}
                onClick={() => setActiveTab("profile")}
                style={{
                  background:
                    activeTab === "profile"
                      ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                      : "transparent",
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                <i className="bi bi-person-gear me-2"></i> Profile & Address
              </button>
              <button
                className={`nav-link text-start py-2.5 px-3 rounded-3 fw-semibold ${
                  activeTab === "payment"
                    ? "active bg-primary text-white"
                    : "text-secondary hover-bg-light"
                }`}
                onClick={() => setActiveTab("payment")}
                style={{
                  background:
                    activeTab === "payment"
                      ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                      : "transparent",
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                <i className="bi bi-credit-card-2-front me-2"></i> Saved
                Payments
              </button>
              <button
                className={`nav-link text-start py-2.5 px-3 rounded-3 fw-semibold ${
                  activeTab === "preferences"
                    ? "active bg-primary text-white"
                    : "text-secondary hover-bg-light"
                }`}
                onClick={() => setActiveTab("preferences")}
                style={{
                  background:
                    activeTab === "preferences"
                      ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                      : "transparent",
                  border: "none",
                  transition: "all 0.2s",
                }}
              >
                <i className="bi bi-sliders me-2"></i> Shop Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="col-12 col-md-9">
          {/* Profile & Address Tab */}
          {activeTab === "profile" && (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h4 className="fw-bold text-dark mb-4">
                Profile & Default Shipping Address
              </h4>
              <form onSubmit={saveProfile}>
                <div className="row g-3">
                  <div className="col-12 d-flex align-items-center gap-4 mb-3">
                    <div style={{ width: 96 }}>
                      <div
                        className="rounded-circle overflow-hidden border"
                        style={{ width: 96, height: 96 }}
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="avatar"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center bg-light text-muted"
                            style={{ width: 96, height: 96 }}
                          >
                            <i className="bi bi-person fs-2"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <label className="form-label small text-secondary fw-semibold">
                        Profile Avatar
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={handleAvatarChange}
                      />
                      <div className="small text-muted mt-1">
                        Optional. Upload a square image for best results.
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control px-3"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control px-3 bg-light text-muted"
                      value={profileForm.email}
                      readOnly
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Default Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control px-3"
                      placeholder="+1 234-567-890"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Default Destination City
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="form-control px-3"
                      placeholder="New York"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-secondary small fw-semibold">
                      Default Shipping Street Address
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      className="form-control px-3"
                      placeholder="123 Main St, Apt 4B"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 fw-semibold"
                    style={{
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                      border: "none",
                    }}
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Saved Payments Tab */}
          {activeTab === "payment" && (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h4 className="fw-bold text-dark mb-2">Saved Payment Method</h4>
              <p className="text-muted small mb-4">
                Securely save card credentials locally for instant, one-click
                autofill during checkout.
              </p>
              <form onSubmit={savePayment}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      className="form-control px-3"
                      placeholder="JOHN DOE"
                      value={paymentForm.cardholderName}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Card Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-white text-muted">
                        <i className="bi bi-credit-card"></i>
                      </span>
                      <input
                        type="text"
                        name="cardNumber"
                        className="form-control px-3"
                        placeholder="4111 2222 3333 4444"
                        maxLength="19"
                        value={paymentForm.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const next = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                          setPaymentForm({ ...paymentForm, cardNumber: next });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-semibold">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      className="form-control px-3"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={paymentForm.expiryDate}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const next =
                          val.length > 2
                            ? `${val.slice(0, 2)}/${val.slice(2, 4)}`
                            : val;
                        setPaymentForm({ ...paymentForm, expiryDate: next });
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-semibold">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      className="form-control px-3"
                      placeholder="123"
                      maxLength="3"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 fw-semibold"
                    style={{
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                      border: "none",
                    }}
                  >
                    Save Payment Method
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Shop Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h4 className="fw-bold text-dark mb-4">
                Shop Settings & Preferences
              </h4>

              <div className="d-flex flex-column gap-4">
                {/* Currency preference */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-dark mb-1">
                      Preferred Currency
                    </h6>
                    <p className="text-secondary small mb-0">
                      Select default currency for catalog displays.
                    </p>
                  </div>
                  <select
                    className="form-select"
                    style={{ width: "150px" }}
                    value={preferences.currency}
                    onChange={(e) =>
                      handlePrefChange("currency", e.target.value)
                    }
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <hr className="text-muted my-1" />

                {/* Theme Mode toggle */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Store Theme Mode</h6>
                    <p className="text-secondary small mb-0">
                      Switch store visualization to dark mode.
                    </p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="themeModeSwitch"
                      style={{
                        width: "45px",
                        height: "22px",
                        cursor: "pointer",
                      }}
                      checked={preferences.darkMode}
                      onChange={(e) =>
                        handlePrefChange("darkMode", e.target.checked)
                      }
                    />
                  </div>
                </div>

                <hr className="text-muted my-1" />

                {/* Email notification toggles */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold text-dark mb-1">
                      Transactional Email Alerts
                    </h6>
                    <p className="text-secondary small mb-0">
                      Receive alerts when shipment status changes.
                    </p>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="emailAlertSwitch"
                      style={{
                        width: "45px",
                        height: "22px",
                        cursor: "pointer",
                      }}
                      checked={preferences.emailAlerts}
                      onChange={(e) =>
                        handlePrefChange("emailAlerts", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles for preferences and dynamic hover transitions */}
      <style>{`
        .hover-bg-light:hover {
          background-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default Settings;
