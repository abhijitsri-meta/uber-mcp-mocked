import { useState } from 'react';
import './ApiEndpoint.css';

const ApiEndpoint = ({ method, endpoint, description, requestPayload, responsePayload }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMethodClass = (method) => {
    return method.toLowerCase();
  };

  return (
    <div className="api-endpoint">
      <div
        className="api-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="api-header-content">
          <span className={`method-badge ${getMethodClass(method)}`}>
            {method}
          </span>
          <span className="endpoint-path">{endpoint}</span>
        </div>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      {isExpanded && (
        <div className="api-details">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          {requestPayload && (
            <div className="detail-section">
              <h3>Request Payload</h3>
              <pre className="code-block">
                {JSON.stringify(requestPayload, null, 2)}
              </pre>
            </div>
          )}

          <div className="detail-section">
            <h3>200 OK - Success Response</h3>
            <pre className="code-block">
              {JSON.stringify(responsePayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiEndpoint;
