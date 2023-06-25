import React, { createContext, useMemo, useEffect } from 'react';
import TrackManager from '../lib/TrackManager.js'

export const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children, apiKey }) => {

  const trackManager = useMemo(() => new TrackManager(apiKey), [apiKey]);

  useEffect(() => {

    const cleanup = trackManager.init();
    return cleanup;
  }, [trackManager]);

  return (
    <AnalyticsContext.Provider
      value={
        trackManager
      }
    >
      {children}
    </AnalyticsContext.Provider>
  );
};


