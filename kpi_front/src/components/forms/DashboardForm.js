import React, { useState } from "react";
import { useQuery } from "react-query";

function DashboardForm({ tags, onAdd }) {
  const [selectedMetric, setSelectedMetric] = useState("clickRate");
  const [selectedTag, setSelectedTag] = useState(tags[0].name);
  const [selectedChartType, setSelectedChartType] = useState("line");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tag = selectedTag;

    const data = {
      metric: selectedMetric,
      tag,
      type: selectedChartType,
      timePeriod: selectedTimePeriod,
    };
    await onAdd(data);
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
            <option value="clickRate">Nombre de clics</option>
            <option value="pageViews">Nombre de pages vues</option>
            <option value="bounceRate">Taux de rebond</option>
            <option value="averageSessionDuration">
              Durée moyenne de session
            </option>
            <option value="session">Sessions</option>
          </select>
        </div>

        {selectedMetric === "clickRate" && (
          <div className="form-group">
            <label>Tag :</label>
            <select
              onChange={(event) => setSelectedTag(event.target.value)}
              className="form-control"
              name="tag"
            >
              {tags.map((tag) => (
                <option key={tag._id} value={tag.name}>
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
          <label>Période de temps :</label>
          <select
            className="form-control"
            name="timePeriod"
            value={selectedTimePeriod}
            onChange={(event) => setSelectedTimePeriod(event.target.value)}
          >
            {selectedMetric === "pageViews" ||
            selectedMetric === "bounceRate" ? (
              <option value="month">Par mois</option>
            ) : (
              <>
                <option value="month">Par mois</option>
                <option value="day">Par jour</option>
                <option value="week">Par semaine</option>
              </>
            )}
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Générer le graphique
        </button>
      </form>
    </>
  );
}

export default DashboardForm;
