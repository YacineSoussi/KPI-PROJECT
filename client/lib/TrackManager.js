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

const throttle = (func, delay) => {
  let timeoutId;
  let lastExecutedTime = 0;

  return function (...args) {
    const context = this;

    const execute = () => {
      func.apply(context, args);
      lastExecutedTime = Date.now();
    };

    const currentTime = Date.now();
    const remainingTime = delay - (currentTime - lastExecutedTime);

    clearTimeout(timeoutId);

    if (remainingTime <= 0) {
      execute();
    } else {
      timeoutId = setTimeout(execute, remainingTime);
    }
  };
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

  // trackHeatmap = ({ tag, positions, page }) => {
  //   const eventData = {
  //     tag,
  //     type: "heatmap",
  //     positions,
  //     page,
  //     apiKey: this.apiKey,
  //     uri: "heatmap",
  //   };
  //   console.log(eventData);
  //   // sendEvent(eventData);
  // };

  trackHeatmap = () => {
    const handleMouseMove = throttle((event) => {
      // Récupérer les coordonnées de la souris
      const { clientX, clientY } = event;

      // Récupérer la taille de la page
      const pageSize = {
        x: window.innerWidth,
        y: window.innerHeight,
      };

      this.trackEvent({
        uri: "heatmap",
        tag: "heatmap",
        type: "heatmap",
        x: clientX,
        y: clientY,
        pageSize: pageSize,
        apiKey: this.apiKey,
        visitorId: getCookie("visitorId"),
        sessionId: getCookie("sessionId"),
      });

      console.log("Mouse coordinates:", clientX, clientY);
      console.log("Page size:", pageSize);
    }, 300);

    // Ajouter un écouteur d'événement pour le mouvement de la souris
    addEventListener(document, "mousemove", handleMouseMove);

    const cleanup = () => {
      // Supprimer l'écouteur d'événement lors du nettoyage
      removeEventListener(document, "mousemove", handleMouseMove);
    };

    // Retourner la fonction de nettoyage
    return cleanup;
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
    const visitorIdCookie = getCookie("visitorId");

    if (!visitorIdCookie) {
      visitorId = uuidv4();
      setCookie("visitorId", visitorId);
    } else {
      visitorId = visitorIdCookie;
    }

    let sessionId;
    if (sessionCookie) {
      sessionId = sessionCookie;
    } else {
      sessionId = localStorage.getItem(sessionCookieName);
      if (!sessionId) {
        sessionId = uuidv4();
      }
      setCookie(sessionCookieName, sessionId);
    }

    // // Gestion de l'événement de changement de visibilité
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const sessionStartTime = getCookie(sessionCookieName);
        const endTime = Date.now();

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
        localStorage.removeItem(sessionCookieName);
      }
    };

    // Encapsule handleVisibilityChange dans une fonction pour pouvoir utiliser sessionEnded
    const handleBeforeVisibilityChangeWrapper = () => {
      handleVisibilityChange(sessionEnded);
    };

    // L'utilisateur est sur un téléphone mobile
    addEventListener(
      document,
      "visibilitychange",
      handleBeforeVisibilityChangeWrapper
    );

    // Fonction de nettoyage
    const cleanup = () => {
      removeEventListener(
        document,
        "visibilitychange",
        handleBeforeVisibilityChangeWrapper
      );
    };

    console.log("sessionCookieName", getCookie(sessionCookieName));
    console.log("visitorId", visitorId);

    // Retourner la fonction de nettoyage
    return cleanup;
  };

  init = () => {
    this.trackPageView();
    const cleanup = this.trackSession();
    return () => {
      cleanup();
    };
  };
}

export default TrackManager;
