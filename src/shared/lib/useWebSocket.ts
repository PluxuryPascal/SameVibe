import { useEffect, useRef } from "react";

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
      onMessage(JSON.parse(evt.data));
    };
    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  return wsRef.current;
}