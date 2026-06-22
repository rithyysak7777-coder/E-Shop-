const About = () => {
  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "40px",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          background: "#f8fafc",
          color: "#0b1220",
          padding: "80px 20px",
          borderBottom: "1px solid #e6eef6",
        }}
      >
        <div className="container text-center">
          <h1
            className="display-4 fw-black mb-4 text-uppercase"
            style={{
              fontFamily: "Arial Black, sans-serif",
              letterSpacing: "-0.05em",
              color: "#0b1220",
            }}
          >
            About E-Shop
          </h1>
          <p className="fs-5 fw-bold" style={{ color: "#475569" }}>
            Your trusted online marketplace for quality products and exceptional
            service
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5" style={{ background: "transparent" }}>
        <div className="container ">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2
                className="fs-3 fw-black mb-3 text-uppercase"
                style={{ fontFamily: "Arial Black, sans-serif" }}
              >
                Our Story
              </h2>
              <p className="text-secondary mb-3" style={{ lineHeight: "1.8" }}>
                Founded in 2020, E-Shop started with a simple mission: to make
                quality products accessible to everyone online. What began as a
                small startup has grown into a thriving e-commerce platform
                serving thousands of customers worldwide.
              </p>
              <p className="text-secondary mb-3" style={{ lineHeight: "1.8" }}>
                We believe in providing not just products, but an experience.
                From browsing to checkout, we've designed every step to be
                intuitive, secure, and enjoyable.
              </p>
              <p className="text-secondary" style={{ lineHeight: "1.8" }}>
                Today, we continue to innovate and improve, always keeping our
                customers' satisfaction at the heart of everything we do.
              </p>
            </div>
            <div className="col-md-6">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                  color: "#0b1220",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 6px 20px rgba(11,18,32,0.04)",
                }}
              >
                <i
                  className="bi bi-bag-heart-fill "
                  style={{ fontSize: "60px" }}
                ></i>
                <h3 className="mt-3 fw-bold">Since 2020</h3>
                <p>Serving customers with excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-5" style={{ background: "#f8fafc" }}>
        <div className="container">
          <h2
            className="fs-3 fw-black text-center mb-5 text-uppercase"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            Our Mission & Values
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{
                    background: "#ffffff",
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <i
                    className="bi bi-star-fill"
                    style={{ fontSize: "24px", color: "#4f6ff7" }}
                  ></i>
                </div>
                <h5 className="fw-bold mb-2">Quality First</h5>
                <p className="text-secondary small">
                  We carefully curate our product selection to ensure quality
                  and value for our customers.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{
                    background: "#ffffff",
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <i
                    className="bi bi-shield-check"
                    style={{ fontSize: "24px", color: "#4f6ff7" }}
                  ></i>
                </div>
                <h5 className="fw-bold mb-2">Customer Trust</h5>
                <p className="text-secondary small">
                  Security, transparency, and reliability are the foundation of
                  our relationship with you.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="text-center">
                <div
                  className="mb-3"
                  style={{
                    background: "#ffffff",
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <i
                    className="bi bi-people-fill"
                    style={{ fontSize: "24px", color: "#4f6ff7" }}
                  ></i>
                </div>
                <h5 className="fw-bold mb-2">Community</h5>
                <p className="text-secondary small">
                  We're building a community where customers can discover,
                  connect, and shop with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-5"
        style={{
          background: "#ffffff",
          borderTop: "2px solid #f1f5f9",
          borderBottom: "2px solid #f1f5f9",
        }}
      >
        <div className="container">
          <h2
            className="fs-3 fw-black text-center mb-5 text-uppercase"
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            By The Numbers
          </h2>
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <h3 className="display-5 fw-black" style={{ color: "#0b1220" }}>
                10K+
              </h3>
              <p className="text-secondary fw-bold">Products</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-5 fw-black" style={{ color: "#0b1220" }}>
                50K+
              </h3>
              <p className="text-secondary fw-bold">Happy Customers</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-5 fw-black" style={{ color: "#0b1220" }}>
                100%
              </h3>
              <p className="text-secondary fw-bold">Satisfaction Rate</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-5 fw-black" style={{ color: "#0b1220" }}>
                24/7
              </h3>
              <p className="text-secondary fw-bold">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 rounded" style={{ background: "#ffffff" }}>
        <div className="container">
          <h2
            className="fs-3 fw-black text-center mb-5 text-black "
            style={{ fontFamily: "Arial Black, sans-serif" }}
          >
            Meet Our Team
          </h2>
          <div className="row g-4">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO" },
              { name: "Mike Chen", role: "Lead Developer" },
              { name: "Emma Davis", role: "Customer Success Manager" },
              { name: "John Smith", role: "Marketing Director" },
            ].map((member, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div
                  className="card text-center h-100"
                  style={{
                    border: "2px solid #000",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      height: "150px",
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px 10px 0 0",
                    }}
                  >
                    <i
                      className="bi bi-person-circle"
                      style={{ fontSize: "60px", color: "#4f6ff7" }}
                    ></i>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title fw-bold">{member.name}</h6>
                    <p className="card-text text-secondary small fw-bold">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
