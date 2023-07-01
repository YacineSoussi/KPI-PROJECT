import { useQuery, useMutation, useQueryClient } from "react-query";

const useGraphManagement = () => {
  const queryClient = useQueryClient();

  const fetchGraphs = async () => {
    const response = await fetch("http://localhost:3000/graphs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const {
    data: graphs,
    isLoading: graphsLoading,
    error: graphsError,
    refetch: refetchGraphs,
  } = useQuery("graphs", fetchGraphs);

  const createGraphMutation = useMutation((body) => {
    return fetch("http://localhost:3000/graphs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...body, apiKey: "23456789" }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  });

  const onAdd = async (body) => {
    try {
      await createGraphMutation.mutateAsync(body);
      queryClient.invalidateQueries("graphs");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const editGraphMutation = useMutation(({ id, body }) => {
    return fetch(`http://localhost:3000/graphs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...body, apiKey: "23456789" }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update graph");
      }
      return response.json();
    });
  });

  const deleteGraphMutation = useMutation((id) => {
    return fetch(`http://localhost:3000/graphs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete graph");
      }
      return response.json();
    });
  });

  const onDelete = async (id) => {
    try {
      await deleteGraphMutation.mutateAsync(id);
      queryClient.invalidateQueries("graphs");
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    graphs,
    graphsLoading,
    graphsError,
    refetchGraphs,
    onAdd,
    editGraphMutation,
    onDelete,
  };
};

export default useGraphManagement;
