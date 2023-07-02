import React from "react";
import { LineChart, BarChart, PieChart } from "./Charts";

const Graph = ({ userGraphs }) => {
  return (
    <div className="d-flex flex-wrap m-2">
      <h2 className="w-100">Graphiques de l'utilisateur</h2>
      {userGraphs &&
        userGraphs.map((graph, index) => {
          let chartComponent;
          switch (graph.data[0].type) {
            case "bar":
              chartComponent = <BarChart data={graph.data[0].data} />;
              break;
            case "line":
              chartComponent = <LineChart data={graph.data[0].data} />;
              break;
            case "pie":
              chartComponent = <PieChart data={graph.data[0].data} />;
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
      {!userGraphs && (
        <p className="w-100">Aucun graphique pour cet utilisateur</p>
      )}
    </div>
  );
};

export default Graph;
