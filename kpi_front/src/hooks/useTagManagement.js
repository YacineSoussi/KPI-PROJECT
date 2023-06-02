import { useQuery, useMutation, useQueryClient } from "react-query";

const useTagManagement = () => {
  const queryClient = useQueryClient();

  const fetchTags = async () => {
    const response = await fetch("http://localhost:3000/tags");
    const data = await response.json();

    return data;
  };

  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
    refetch: refetchTags,
  } = useQuery("tags", fetchTags);

  const createTagMutation = useMutation((body) => {
    return fetch("http://localhost:3000/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, apiKey: "23456789" }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      return response.json();
    });
  });

  const onAdd = async (body) => {
    try {
      await createTagMutation.mutateAsync(body);
      queryClient.invalidateQueries("tags");
    } catch (error) {
      console.log(error);
    }
  };

  const editTagMutation = useMutation(({ id, body }) => {
    return fetch(`http://localhost:3000/tags/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, apiKey: "23456789" }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update tag");
      }
      return response.json();
    });
  });

  const deleteTagMutation = useMutation((id) => {
    return fetch(`http://localhost:3000/tags/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
    });
  });

  const onEdit = async (id, body) => {
    try {
      await editTagMutation.mutateAsync({ id, body });
      queryClient.invalidateQueries("tags");
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteTagMutation.mutateAsync(id);

      queryClient.invalidateQueries("tags");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    tags,
    tagsLoading,
    tagsError,
    refetchTags,
    onAdd,
    onEdit,
    onDelete,
  };
};

export default useTagManagement;
