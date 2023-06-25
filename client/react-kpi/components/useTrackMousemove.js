import { useContext, useEffect, useState } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";

export const useTrackMousemove = () => {
  const trackManager = useContext(AnalyticsContext);

  useEffect(() => {
    const cleanup = trackManager.trackHeatmap();

    return () => {
      cleanup();
    };
  }, [trackManager]);

  return null;
};
