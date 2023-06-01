import React, { useState } from "react";
import Graph from "../components/Graph/Graph";
import DashboardForm from "../components/DashboardForm";
import TagForm from "../components/TagForm";
import { useQuery } from "react-query";

const Dashboard = () => {
  const fetchTags = async () => {
    const response = await fetch("http://localhost:3000/tags");
    const data = await response.json();
    return data;
  };

  const {
    data: tags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useQuery("tags", fetchTags);

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
            <img src="../assets/loading.gif" alt="Loading" />
          </div>
        ) : (
          <>
            <div className="w-50">
              <DashboardForm tags={tags} />
            </div>
            <div className="w-50">
              <TagForm tags={tags} />
            </div>
            <Graph userGraphs={userGraphs} />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
