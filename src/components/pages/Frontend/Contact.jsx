import { useState } from "react";
import { api } from "../../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("All fields are required!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <h1
              className="fs-3 fw-bold mb-2 text-center"
              style={{ color: "#0b1220" }}
            >
              <i className="bi bi-telephone me-2"></i>
              Contact Us
            </h1>
            <p className="text-center text-muted mb-5">
              Have a question? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>

            {success && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-check-circle me-2"></i>
                Thank you! Your message has been sent successfully. We'll get
                back to you soon!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "10px 15px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "10px 15px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label fw-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "10px 15px",
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-semibold">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    padding: "10px 15px",
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
                disabled={loading}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  background: loading
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                  border: "none",
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Send Message
                  </>
                )}
              </button>
            </form>

            <div
              className="mt-5 p-4"
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 6px 20px rgba(11,18,32,0.06)",
              }}
            >
              <h5 className="fw-bold mb-3">Other Ways to Reach Us</h5>
              <div className="d-flex align-items-center mb-2">
                <i
                  className="bi bi-envelope text-primary me-3"
                  style={{ fontSize: "20px" }}
                ></i>
                <div>
                  <p className="mb-0 small text-muted">Email</p>
                  <p className="mb-0 fw-semibold">support@eshop.com</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i
                  className="bi bi-telephone text-primary me-3"
                  style={{ fontSize: "20px" }}
                ></i>
                <div>
                  <p className="mb-0 small text-muted">Phone</p>
                  <p className="mb-0 fw-semibold">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-geo-alt text-primary me-3"
                  style={{ fontSize: "20px" }}
                ></i>
                <div>
                  <p className="mb-0 small text-muted">Address</p>
                  <p className="mb-0 fw-semibold">
                    123 Shopping Street, Commerce City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
