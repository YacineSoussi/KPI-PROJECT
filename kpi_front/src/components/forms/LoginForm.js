import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { onLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onLogin({ email: username, password });
    } catch (error) {
      setError("Échec de la connexion. Veuillez vérifier vos informations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Chargement..." : "Se connecter"}
        </button>
        {error && <p className="text-danger m-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
