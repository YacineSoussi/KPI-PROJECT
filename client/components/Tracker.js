import React, { useEffect } from 'react';

const Tracker = ({ tag, category = 'default' }) => {
  const handleClick = (event) => {
    // Envoyer l'événement de suivi à votre serveur
    // Cette fonction peut également inclure la gestion des erreurs et le suivi de l'état de la connexion
    // Les informations d'événement (catégorie, action, étiquette) sont passées en tant que paramètres
  };

  useEffect(() => {
    const element = document.querySelector(tag);
    if (element) {
      element.addEventListener('click', handleClick);
    }
    return () => {
      if (element) {
        element.removeEventListener('click', handleClick);
      }
    };
  }, [tag, handleClick]);

  return null;
};

export default Tracker;
