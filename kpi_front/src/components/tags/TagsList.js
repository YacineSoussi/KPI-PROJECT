import React from "react";
import Tag from "./Tag";

const TagsList = ({ tags, onDelete, onEdit }) => {
  return (
    <>
      <h2 className="text-lg font-semibold m-4">Liste des tags</h2>
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
    </>
  );
};

export default TagsList;
