import React, {Fragment} from "react";
import ReactDOM from "react-dom/client";

const Main = () => {
  return (
    <h1>Hello !</h1>
  );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<Main />);