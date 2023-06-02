import React, { useState } from "react";
import { useQuery } from "react-query";

const TagForm = ({ onAdd, setIsAdding }) => {
  const [tagName, setTagName] = useState("");
  const [description, setDescription] = useState("");

  const handleTagNameChange = (event) => {
    setTagName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({ name: tagName, description });
    setTagName("");
    setDescription("");
    setIsAdding(false);
  };

  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">
        Formulaire de création de tags
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Nom du tag :</label>
          <input
            type="text"
            className="form-control"
            value={tagName}
            onChange={handleTagNameChange}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Description :</label>
          <textarea
            className="form-control"
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>
    </div>
  );
};

export default TagForm;
