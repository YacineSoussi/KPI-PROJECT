import { useContext, useEffect, useRef } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";

export const useTrackElement = (eventTag, eventType) => {
  const trackManager = useContext(AnalyticsContext);

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
