import React, { useState, useEffect } from 'react';

const ResponseTimeToast = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleApiResponse = (event) => {
      const { url, duration, method, error } = event.detail;
      const newLog = {
        id: Date.now(),
        url,
        duration,
        method,
        error,
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 3));

      setTimeout(() => {
        setLogs((prev) => prev.filter((log) => log.id !== newLog.id));
      }, 5000);
    };

    window.addEventListener('api-response-time', handleApiResponse);
    return () => window.removeEventListener('api-response-time', handleApiResponse);
  }, []);

  return (
    <div className="rt-toast-container">
      {logs.map((log) => (
        <div key={log.id} className={`rt-toast ${log.error ? 'error' : 'success'}`}>
          <span className="rt-method" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{log.method}</span>
          <span className="rt-url" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {log.url.split('/').pop().split('?')[0] || 'API'}
          </span>
          <span className="rt-ms">응답: {log.duration}ms</span>
        </div>
      ))}
    </div>
  );
};

export default ResponseTimeToast;
