import { useState, useEffect, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws';

export const useWebSocket = (url: string = WEBSOCKET_URL) => {
  const [data, setData] = useState<any[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log('Received message:', message);
      switch (message.type) {
        case 'initial_data':
          setData(message.data);
          break;
        case 'data_update':
          setData(prev => [...prev, message.data]);
          break;
        case 'stream':
          setData(prev => [...prev, message]);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return {
    data,
    isConnected,
    socket
  };
};

// Example usage in another component:
// const { data, isConnected, socket } = useWebSocket();