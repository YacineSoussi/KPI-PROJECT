import React, { useState } from "react";

const RegisterForm = ({ onRegister, registerLoading, setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isUrl, setIsUrl] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const isNotValid = validateFields();
    // Continuer avec la logique d'inscription si tous les champs sont valides
    if (!isNotValid) {
      onRegister({ email, password, url });
    }
  };

  const validateFields = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    setIsEmail(!emailRegex.test(email));
    setIsPassword(password.length < 6);
    setIsUrl(!urlRegex.test(url));

    return (
      !emailRegex.test(email) || password.length < 6 || !urlRegex.test(url)
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className={`form-group ${isEmail ? "has-error" : ""}`}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className={`form-control ${isEmail ? "is-invalid" : ""}`}
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {isEmail && <p className="text-danger">Adresse email invalide.</p>}
      </div>
      <div className={`form-group ${isPassword ? "has-error" : ""}`}>
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          className={`form-control ${isPassword ? "is-invalid" : ""}`}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isPassword && <p className="text-danger">Mot de passe invalide.</p>}
      </div>
      <div className={`form-group ${isUrl ? "has-error" : ""}`}>
        <label htmlFor="url">URL</label>
        <input
          type="text"
          className={`form-control ${isUrl ? "is-invalid" : ""}`}
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {isUrl && (
          <p className="text-danger">Veuillez saisir une URL valide.</p>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary mt-2"
        disabled={registerLoading}
      >
        {registerLoading ? "Chargement..." : "S'inscrire"}
      </button>
    </form>
  );
};

export default RegisterForm;
