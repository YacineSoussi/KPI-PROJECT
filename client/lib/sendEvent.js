const sendEvent = ({ uri, ...data }) => {
  const url = `http://localhost:3000/${uri}`;

  data.userAgent = navigator.userAgent;
  data.referer = document.referrer;
  data.url = window.location.href;

  console.log("sendEvent", { ...data });

  if (navigator.sendBeacon) {
    const jsonData = JSON.stringify({ ...data });
    const blob = new Blob([jsonData], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
        "User-Agent": navigator.userAgent,
        Referer: document.referrer,
      },
    });
  }
};

export default sendEvent;
