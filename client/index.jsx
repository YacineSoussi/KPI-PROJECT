import React, { useRef, useContext } from "react";
import ReactDOM from "react-dom/client";
import AnalyticsProvider from "./components/AnalyticsProvider";
import useTrackElement from "./components/useTrackElement";

const OtherComponent = () => {

  const elementRef = useTrackElement("button1", "mouseover");
  const elementRef2 = useTrackElement("button2", "click");

  return (
    <>
      <button ref={elementRef}>
        My Element
      </button>
      <a href="/">
        <button ref={elementRef2}>
          My Element 2
        </button>

      </a>
    </>
  );
};

const Main = () => {
  const apiKey = 'xxx';
  return (
    <>
      <AnalyticsProvider apiKey={apiKey}>
        <OtherComponent />
      </AnalyticsProvider>
    </>
  );
};

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(<Main />);