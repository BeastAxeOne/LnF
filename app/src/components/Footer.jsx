import { Link } from "react-router";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">

        <div className="footer-content">

          <div className="footer-brand glass">
            <h3>L&F</h3>
            <p>
              Every Lost Thing Will Be Found!
            </p>
          </div>

          <div className="footer-column glass">
            <h4>System</h4>
            <div className="footer-links">
              <Link to="/finditem">Find Item</Link>
              <Link to="/postitem">Post Item</Link>
            </div>
          </div>

          <div className="footer-column glass">
            <h4>Info</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 L&F. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}