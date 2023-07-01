import React, { useState } from "react";
import Graph from "../components/graphs/Graph";
import DashboardForm from "../components/forms/DashboardForm";
import useTagManagement from "../hooks/useTagManagement";
import TagsList from "../components/tags/TagsList";
import Header from "../components/common/Header";
import ApiKey from "../components/ApiKey";
import useGraphManagement from "../hooks/useGraphManagement";

const Dashboard = () => {
  const { tags, tagsLoading, onAdd, onEdit, onDelete } = useTagManagement();

  const { graphs, onAdd: onAddGraph } = useGraphManagement();

  return (
    <>
      <Header />
      <ApiKey />
      <div className="d-flex flex-wrap">
        {tagsLoading ? (
          <div className="d-flex justify-content-center align-items-center w-100">
            <img src="loading.gif" alt="Loading" />
          </div>
        ) : (
          <>
            <div className="w-50">
              <DashboardForm tags={tags} graphs={graphs} onAdd={onAddGraph} />
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
            <Graph userGraphs={graphs} graphs={graphs} />
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
