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

class TrackManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  trackEvent = ({ uri, ...data }) => {
    sendEvent({ uri, ...data });
  };

  trackElement = ({ tag, event, element }) => {
    console.log("trackElement", element, event);

    const handleEvent = () => {
      const eventData = {
        tag,
        type: event,
        apiKey: this.apiKey,
        uri: "events",
      };
      this.trackEvent({
        uri: "events",
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
    console.log(eventData);
    // sendEvent(eventData);
  };

  trackPageView = () => {
    const page = window.location.pathname;
    const eventData = {
      tag: "pageView",
      type: "pageView",
      page,
      apiKey: this.apiKey,
      visitorId: localStorage.getItem("visitorId"),
      sessionId: localStorage.getItem("sessionId"),
    };

    this.trackEvent({
      uri: "pageViews",
      ...eventData,
    });
  };

  trackSession = () => {
    const sessionCookieName = "sessionId";
    const sessionCookie = getCookie(sessionCookieName);
    let visitorId;
    let sessionEnded = false;
    // Check if the visitorId cookie exists
    const visitorIdCookie = getCookie("visitorId");
    if (!visitorIdCookie) {
      // If it doesn't exist, create a new visitorId and set the cookie
      visitorId = uuidv4();
      setCookie("visitorId", visitorId);
    } else {
      // If it exists, retrieve the visitorId from the cookie
      visitorId = visitorIdCookie;
    }

    // Check if the session cookie exists
    if (!sessionCookie) {
      const startTime = Date.now();

      setCookie(sessionCookieName, startTime);
    }

    // Variable pour compter le nombre d'onglets ouverts
    let openTabsCount = 1;

    // Gestion de l'événement de changement de visibilité
    const handleVisibilityChange = (sessionEnded) => {
      if (document.visibilityState === "hidden") {
        openTabsCount--;
        if (openTabsCount === 0 && !sessionEnded) {
          sessionEnded = true; // Prevents multiple session end events
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
        }
      } else if (document.visibilityState === "visible") {
        openTabsCount++;
      }
    };

    // Encapsule handleVisibilityChange dans une fonction pour pouvoir utiliser sessionEnded
    const handleBeforeVisibilityChangeWrapper = () => {
      handleVisibilityChange(sessionEnded);
    };

    addEventListener(
      document,
      "visibilitychange",
      handleBeforeVisibilityChangeWrapper
    );

    // Gestion de l'événement beforeunload pour les navigateurs qui le supportent
    const handleBeforeUnload = (sessionEnded) => {
      openTabsCount--;
      if (openTabsCount === 0 && !sessionEnded) {
        sessionEnded = true; // Prevents multiple session end events
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
      }
    };

    // Encapsule handleBeforeUnload dans une fonction pour pouvoir utiliser sessionEnded
    const handleBeforeUnloadWrapper = () => {
      handleBeforeUnload(sessionEnded);
    };

    addEventListener(window, "beforeunload", handleBeforeUnloadWrapper);

    // Gestion de l'événement unload pour les navigateurs qui ne supportent pas beforeunload
    const handleUnload = (sessionEnded) => {
      openTabsCount--;
      if (openTabsCount === 0 && !sessionEnded) {
        sessionEnded = true; // Prevents multiple session end events
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
      }
    };

    const handleUnloadWrapper = () => {
      handleUnload(sessionEnded);
    };
    addEventListener(window, "unload", handleUnloadWrapper);

    // Fonction de nettoyage
    const cleanup = () => {
      removeEventListener(
        document,
        "visibilitychange",
        handleBeforeVisibilityChangeWrapper
      );
      removeEventListener(window, "beforeunload", handleBeforeUnloadWrapper);
      removeEventListener(window, "unload", handleUnloadWrapper);
    };

    // Retourner la fonction de nettoyage
    return cleanup;
  };

  init = () => {
    this.trackPageView();
    this.trackSession();
  };
}

export default TrackManager;
