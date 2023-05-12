import { useContext, useEffect, useState } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";

const useTrackMouseover = (eventTag) => {
  const trackManager = useContext(AnalyticsContext);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { pageX, pageY } = event;
      setPositions((positions) => [...positions, { x: pageX, y: pageY }]);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (positions.length > 0) {
        trackManager.trackHeatmap({
          tag: eventTag,
          positions,
        });
      }
    };
  }, [eventTag, positions, trackManager]);

  return null;
};

export default useTrackMouseover;
