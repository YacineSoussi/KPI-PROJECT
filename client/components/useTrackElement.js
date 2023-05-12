import { useContext, useEffect, useRef } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";

const useTrackElement = (eventTag, eventType) => {
  const trackManager = useContext(AnalyticsContext);
  console.log(trackManager);

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const unbind = trackManager.trackElement({
        element: ref.current,
        tag: eventTag,
        event: eventType,
      });
      return unbind;
    }
  }, [ref.current, eventTag, eventType, trackManager]);

  return ref;
};

export default useTrackElement;
