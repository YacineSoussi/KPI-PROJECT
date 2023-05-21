const sendEvent = ({ uri, ...data }) => {
  const url = `http://localhost:3000/${uri}`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      url,
      JSON.stringify({
        ...data,
      })
    );
  } else {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export default sendEvent;
