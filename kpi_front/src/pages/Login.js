import React from "react";
import LoginForm from "../components/forms/LoginForm";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";

const Login = () => {
  return (
    <>
      <Header />
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6 mb-4">
            <LoginForm />
            <p className="mt-3">
              Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
