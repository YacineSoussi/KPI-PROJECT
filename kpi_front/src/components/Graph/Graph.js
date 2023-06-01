import React from "react";
import { LineChart, BarChart, PieChart } from "./Charts";

const Graph = ({ userGraphs }) => {
  return (
    <div className="d-flex flex-wrap">
      <h2 className="w-100">Graphiques de l'utilisateur</h2>
      {userGraphs.map((graph, index) => {
        let chartComponent;
        switch (graph.type) {
          case "bar":
            chartComponent = <BarChart data={graph.data} />;
            break;
          case "line":
            chartComponent = <LineChart data={graph.data} />;
            break;
          case "pie":
            chartComponent = <PieChart data={graph.data} />;
            break;
          default:
            chartComponent = null;
        }

        return (
          <div key={index} className="w-25 p-4">
            {chartComponent}
          </div>
        );
      })}
    </div>
  );
};

export default Graph;
