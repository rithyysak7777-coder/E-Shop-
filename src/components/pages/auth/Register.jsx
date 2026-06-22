import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegisterAccount } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // handle input text
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    setForm({
      ...form,
      image: file,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("image", form.image);

    console.log("Register Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await RegisterAccount(formData);

      console.log(res);

      if (res.status === "Success") {
        alert("User Register successfully");
        navigate("/");
      } else {
        alert(res.message || "Registration failed. Please try again.");
        navigate("/register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "480px" }}>
        <h3 className="text-center mb-4">Register</h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label className="form-label">Profile Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImage}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="text-center mb-3">
              <img
                src={preview}
                alt="preview"
                width="100"
                height="100"
                className="rounded-circle border"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Button */}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
          <p className="text-center mt-3 mb-0">
            You have already account? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
