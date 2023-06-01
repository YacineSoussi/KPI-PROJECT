import React, { useState } from "react";

function Tag({ tag, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(tag.name);
  const [editedDescription, setEditedDescription] = useState(tag.description);

  const handleEdit = () => {
    if (isEditing) {
      // Appeler la fonction de modification avec les nouvelles valeurs
      onEdit(tag._id, { name: editedName, description: editedDescription });
    }

    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedName(tag.name);
    setEditedDescription(tag.description);
  };

  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </td>
        </>
      ) : (
        <>
          <td>{tag.name}</td>
          <td>{tag.description}</td>
        </>
      )}
      <td>
        <button className="btn btn-sm btn-warning" onClick={handleEdit}>
          {isEditing ? "Valider" : "Modifier"}
        </button>

        {isEditing ? (
          <button
            className="btn btn-sm btn-secondary ms-2"
            onClick={cancelEdit}
          >
            Annuler
          </button>
        ) : (
          <button
            className="btn btn-sm btn-danger ms-2"
            onClick={() => onDelete(tag._id)}
          >
            Supprimer
          </button>
        )}
      </td>
    </tr>
  );
}

export default Tag;
