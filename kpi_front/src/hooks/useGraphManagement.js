import { useQuery, useMutation, useQueryClient } from "react-query";
import useAuth from "./useAuth";

const useGraphManagement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchGraphs = async () => {
    const response = await fetch("http://localhost:3000/graphs");
    const data = await response.json();
    return data.slice(-7);
  };

  const generateGraphs = async (graphs) => {
    if (graphs) {
      const updatedGraphs = await Promise.all(
        graphs.map(async (graph) => {
          const body = {
            metric: graph.metric,
            tag: graph.tag,
            type: graph.type,
            timePeriod: graph.timePeriod,
            apiKey: user?.apiKey,
          };
          const response = await fetch(
            "http://localhost:3000/graphs/aggregate",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          const updatedGraph = {
            ...graph,
            data: result[0] ? result[0].data : null,
          };
          return updatedGraph;
        })
      );

      return updatedGraphs;
    }
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
