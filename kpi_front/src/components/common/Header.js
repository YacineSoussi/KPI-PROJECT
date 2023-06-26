import React from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            KPI
          </Link>

          {user ? (
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/tags"
                  >
                    Tags
                  </Link>
                </li>
              </ul>
              <div className="d-flex">
                <span className="navbar-text me-3">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  className="btn btn-outline-light"
                  onClick={() => logout()}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <Link
                to="/login"
                className="btn btn-outline-light"
                onClick={() => logout()}
              >
                Connexion / inscription
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
