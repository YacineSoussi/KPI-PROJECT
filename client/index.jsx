import React, { useRef, useContext } from "react";
import ReactDOM from "react-dom/client";
import AnalyticsProvider from "./components/AnalyticsProvider";
import useTrackElement from "./components/useTrackElement";
import useTrackMousemove from "./components/useTrackMousemove";

const OtherComponent = () => {

  const elementRef1 = useTrackElement("button1", "click");
  const elementRef2 = useTrackElement("button2", "click");


  // useTrackMousemove();

  return (
    <>
      <button ref={elementRef1}>
        My Element
      </button>
      <button ref={elementRef2}>
        My Element 2
      </button>

    </>
  );
};

const Main = () => {
  const apiKey = 'kgq5bq5ximpeggdm0wcc';
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