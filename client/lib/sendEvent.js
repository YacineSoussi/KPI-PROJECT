const sendEvent = ({ uri, ...data }) => {
  const url = `http://localhost:3000/${uri}`;

  data.url = window.location.href;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": navigator.userAgent,
      Referer: document.referrer,
    },
  });
};

export default sendEvent;
