import React, { useState } from "react";
import Graph from "../components/graphs/Graph";
import DashboardForm from "../components/forms/DashboardForm";
import TagForm from "../components/forms/TagForm";
import useTagManagement from "../hooks/useTagManagement";
import TagsList from "../components/tags/TagsList";
import Header from "../components/common/Header";

const Dashboard = () => {
  const { tags, tagsLoading, tagsError, refetchTags, onAdd, onEdit, onDelete } =
    useTagManagement();

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
      <Header />
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
