import React, { createContext, useMemo, useEffect } from 'react';
import TrackManager from '../lib/TrackManager.js'

export const AnalyticsContext = createContext(null);

const AnalyticsProvider = ({ children, apiKey }) => {

  const trackManager = useMemo(() => new TrackManager(apiKey), [apiKey]);

  useEffect(() => {
    trackManager.init();
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


export default AnalyticsProvider;
