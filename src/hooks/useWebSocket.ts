import { useEffect, useRef } from 'react';

const useWebSocket = (url: string, onMessage: (event: MessageEvent) => void) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => { /* Handle onopen */ };
    ws.onmessage = onMessage;
    ws.onclose = () => { /* Handle onclose */ };
    ws.onerror = () => { /* Handle onerror */ };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  return wsRef;
};

export default useWebSocket;
