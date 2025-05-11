import { useEffect } from "react";

export function useWebSocket(
  url: string | null,
  onMessage: (data: any) => void,
  options: { enabled?: boolean } = {}
) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled || !url) return;

    const socket = new WebSocket(url);
    socket.onmessage = (evt) => {
      onMessage(JSON.parse(evt.data));
    };
    return () => {
      socket.close();
    };
  }, [url, enabled]);
}