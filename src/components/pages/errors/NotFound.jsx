
const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-4">
        
        <h1 className="display-1 fw-bold text-danger">404</h1>
        
        <h2 className="mb-3">Page Not Found</h2>
        
        <p className="text-muted mb-4">
          Sorry, the page you are looking for does not exist.
        </p>

        <a href="/" className="btn btn-primary px-4">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;