import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const ApiKey = () => {
  const { user } = useAuth();
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    setApiKeyCopied(true);
    setTimeout(() => {
      setApiKeyCopied(false);
    }, 2000);
  };

  return (
    <div className={`copy-api-key ${apiKeyCopied ? "copied" : ""}`}>
      <div className="copy-api-key-content">
        <div className="copy-api-key-text">
          {apiKeyCopied ? "API Key Copied!" : user && `API Key: ${user.apiKey}`}
        </div>
        <div className="copy-api-key-icon" onClick={handleCopyApiKey}>
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
