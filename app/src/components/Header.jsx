import { Link } from "react-router";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="container header-container">

        {/* BRAND */}
        <div className="nav-brand">
          <Link to="/" className="logo">
            L&F
          </Link>
        </div>

        {/* NAV LINKS */}
        <nav className="nav-menu">
          <Link className="nav-link" to="/postitem">📋 Post</Link>
          <Link className="nav-link" to="/finditem">🔍 Find</Link>
          <Link className="nav-link" to="/track">📍 Track</Link>
          <Link className="nav-link" to="/about">🌐 About</Link>
        </nav>

      </div>
    </header>
  );
}