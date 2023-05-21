import sendEvent from "./sendEvent";
import { v4 as uuidv4 } from "uuid";

const eventListeners = {};

const addEventListener = (el, type, callback) => {
  const key = `${el}${type}${callback}`;
  if (!eventListeners[key]) {
    eventListeners[key] = [el, type, callback];
    el.addEventListener(type, callback);
  }
};

const removeEventListener = (el, type, callback) => {
  const key = `${el}${type}${callback}`;
  if (eventListeners[key]) {
    const [storedEl, storedType, storedCallback] = eventListeners[key];
    if (storedEl === el && storedType === type && storedCallback === callback) {
      el.removeEventListener(type, callback);
      delete eventListeners[key];
    }
  }
};

function setCookie(name, value) {
  const cookieValue = encodeURIComponent(value);
  document.cookie = `${name}=${cookieValue}; path=/`;
}

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};

const generateSessionId = () => {
  return uuidv4();
};

class TrackManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  trackEvent = ({ uri, ...data }) => {
    sendEvent({ uri, ...data });
  };

  trackElement = ({ tag, event, element }) => {
    const handleEvent = () => {
      const eventData = {
        tag,
        type: event,
        apiKey: this.apiKey,
        uri: "events",
      };
      this.trackEvent({
        uri,
        ...eventData,
      });
    };

    addEventListener(element, event, handleEvent);

    return () => {
      removeEventListener(element, event, handleEvent);
    };
  };

  trackHeatmap = ({ tag, positions, page }) => {
    const eventData = {
      tag,
      type: "heatmap",
      positions,
      page,
      apiKey: this.apiKey,
      uri: "heatmap",
    };
  };

  trackPageView = () => {
    const page = window.location.pathname;
    const eventData = {
      tag: "pageView",
      type: "pageView",
      page,
      apiKey: this.apiKey,
    };
  };

  trackSession = () => {
    const sessionCookieName = "mySiteSession";
    const sessionCookie = getCookie(sessionCookieName);
    let visitorId;

    if (!sessionCookie) {
      const startTime = Date.now();

      setCookie(sessionCookieName, startTime);

      visitorId = uuidv4();

      localStorage.setItem("visitorId", visitorId);
    } else {
      visitorId = localStorage.getItem("visitorId");
    }

    window.addEventListener("beforeunload", () => {
      const sessionStartTime = getCookie(sessionCookieName);
      const endTime = Date.now();
      const sessionId = uuidv4();

      this.trackEvent({
        uri: "sessions",
        data: {
          event: "session",
          sessionId,
          startTime: sessionStartTime,
          endTime,
          duration: endTime - sessionStartTime,
          apiKey: this.apiKey,
          visitorId,
        },
      });

      deleteCookie(sessionCookieName);
    });
  };

  trackFirstVisit = () => {
    const cookieName = "mySiteFirstVisit";
    const cookieValue = getCookie(cookieName);

    // If the cookie does not exist, set it and track the event
    if (!cookieValue) {
      setCookie(cookieName, "true");

      // Track the event using your preferred tracking method
      this.trackEvent({
        uri: "first-visits",
        data: {
          event: "first-visit",
          timestamp: Date.now(),
          apiKey: this.apiKey,
          visitorId: localStorage.getItem("visitorId"),
        },
      });
    }
  };

  init = () => {
    this.trackPageView();
    this.trackSession();
  };
}

export default TrackManager;
