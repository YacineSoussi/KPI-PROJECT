import React, { useState } from "react";
import { useQuery } from "react-query";

function DashboardForm({ tags }) {
  const [selectedMetric, setSelectedMetric] = useState("bounceRate");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [selectedDimension, setSelectedDimension] = useState("source");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("day");

  const fetchPostGraphData = async (data) => {
    const response = await fetch("http://localhost:3000/graphs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const tag = selectedTag;

    const data = {
      metric: selectedMetric,
      tag,
      chartType: selectedChartType,
      dimension: selectedDimension,
      timePeriod: selectedTimePeriod,
    };
    // await fetchGraphData(data);
  };

  return (
    <>
      <h2 className="text-lg font-semibold m-4">
        Formulaire de création de graphs
      </h2>
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Métrique :</label>
          <select
            className="form-control"
            name="metric"
            value={selectedMetric}
            onChange={(event) => setSelectedMetric(event.target.value)}
          >
            <option value="bounceRate">Taux de rebond</option>
            <option value="averageSessionDuration">
              Durée moyenne de session
            </option>
            <option value="pageViews">Nombre de pages vues</option>
            <option value="clickRate">Taux de clic</option>
            <option value="session">Sessions</option>
          </select>
        </div>

        {selectedMetric === "clickRate" && (
          <div className="form-group">
            <label>Tag :</label>
            <select
              onInput={(event) => setSelectedTag(event.target.value)}
              className="form-control"
              name="tag"
            >
              {tags.map((tag) => (
                <option key={tag._id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Type de graphique :</label>
          <select
            className="form-control"
            name="chartType"
            value={selectedChartType}
            onChange={(event) => setSelectedChartType(event.target.value)}
          >
            <option value="line">Ligne</option>
            <option value="bar">Barres</option>
            <option value="pie">Camembert</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dimension :</label>
          <select
            className="form-control"
            name="dimension"
            value={selectedDimension}
            onChange={(event) => setSelectedDimension(event.target.value)}
          >
            <option value="source">Source de trafic</option>
            <option value="browser">Navigateur</option>
            <option value="device">Appareil</option>
          </select>
        </div>

        <div className="form-group">
          <label>Période de temps :</label>
          <select
            className="form-control"
            name="timePeriod"
            value={selectedTimePeriod}
            onChange={(event) => setSelectedTimePeriod(event.target.value)}
          >
            <option value="day">Par jour</option>
            <option value="week">Par semaine</option>
            <option value="month">Par mois</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary m-2">
          Générer le graphique
        </button>
      </form>
    </>
  );
}

export default DashboardForm;
