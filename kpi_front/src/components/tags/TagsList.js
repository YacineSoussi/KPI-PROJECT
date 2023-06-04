import React, { useState } from "react";
import Tag from "./Tag";
import TagForm from "../forms/TagForm";

const TagsList = ({ tags, onDelete, onEdit, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center pr-3">
        <h2 className="text-lg font-semibold m-4">Liste des tags</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Annuler" : "Ajouter"}
        </button>
      </div>
      {isAdding ? (
        <TagForm onAdd={onAdd} setIsAdding={setIsAdding} />
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Tag
                  key={tag._id}
                  tag={tag}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <tr>
                <td colSpan={3}>Aucun tag</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TagsList;
