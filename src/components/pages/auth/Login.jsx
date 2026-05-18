import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginAccount } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {

  const {HandleLogin} = useContext(AuthContext)

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const res = await LoginAccount(formData);

        console.log(res.data);
        console.log(res.data.status);

        if (res.data.status == "success") {
            alert("User login successfully");

            HandleLogin(res.data.user,res.data.token)

            navigate("/dashboard");
        } else {
            alert("Invalid email and password");
            navigate("/");
        }

    } catch (error) {
        console.log(error);
        alert("Server error or invalid credentials");
    }
};

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div className="card shadow-lg border-1">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <p className="text-center mt-3 mb-0">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
