import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import RegisterForm from "../components/forms/RegisterForm";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [error, setError] = useState(null);
  const { onRegister } = useAuth();
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setRegisterLoading(true);

    try {
      await onRegister(data);
      navigate("/login");
    } catch (error) {
      setError("Échec de l'inscription : " + error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center vh-100 mt-5">
        <div className="col-md-6">
          <div className="text-center">
            <h2>Inscription</h2>
          </div>
          <div className="mt-4">
            <RegisterForm
              onRegister={handleRegister}
              registerLoading={registerLoading}
              setError={setError}
            />
            {error && <p className="text-danger">{error}</p>}
            <p>
              Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
