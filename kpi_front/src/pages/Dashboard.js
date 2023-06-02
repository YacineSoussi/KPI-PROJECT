import React, { useState } from "react";
import Graph from "../components/Graph/Graph";
import DashboardForm from "../components/DashboardForm";
import TagForm from "../components/TagForm";
import { useQuery, useMutation, useQueryClient } from "react-query";
import TagsList from "../components/tags/TagsList";

const Dashboard = () => {
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
      body: JSON.stringify(body),
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

  const userGraphs = [
    {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Ventes",
            data: [120, 150, 180],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
    },
    {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Ventes",
            data: [120, 150, 140],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    },
    {
      type: "pie",
      data: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [
          {
            label: "Ventes",
            data: [120, 150, 180],
            backgroundColor: ["#FF6384", "#00ff00", "#0000ff"],
          },
        ],
      },
    },
  ];
  const selectedMetric = "clickRate";

  return (
    <>
      <div className="d-flex flex-wrap">
        {tagsLoading ? (
          <div className="d-flex justify-content-center align-items-center w-100">
            <img src="loading.gif" alt="Loading" />
          </div>
        ) : (
          <>
            <div className="w-50">
              <DashboardForm tags={tags} />
            </div>
            <div className="w-50">
              {/* <TagForm tags={tags} /> */}
              <TagsList
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
                tags={tags}
              />
            </div>
            <Graph userGraphs={userGraphs} />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
