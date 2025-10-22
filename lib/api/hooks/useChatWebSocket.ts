import { useState, useEffect, useRef, useCallback } from 'react';
import { createChatWebSocket, type ChatWebSocket } from '../services';
import type { WebSocketMessage } from '../types';

export const useChatWebSocket = (conversationId: string, autoConnect = true) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<ChatWebSocket | null>(null);

  // Conectar ao WebSocket
  const connect = useCallback(async () => {
    if (wsRef.current?.isConnected()) {
      return;
    }

    const ws = createChatWebSocket(conversationId);
    wsRef.current = ws;

    // Handler para mudanças de conexão
    ws.onConnection((isConnected) => {
      setConnected(isConnected);
    });

    // Handler para mensagens recebidas
    ws.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    try {
      await ws.connect();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [conversationId]);

  // Desconectar do WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
      setConnected(false);
    }
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(
    (content: string, messageType: 'text' | 'voice' | 'image' = 'text', contextHint?: string) => {
      if (!wsRef.current?.isConnected()) {
        throw new Error('WebSocket is not connected');
      }

      wsRef.current.sendMessage(content, messageType, contextHint);
    },
    []
  );

  // Enviar indicador de "está digitando"
  const sendTyping = useCallback(() => {
    if (wsRef.current?.isConnected()) {
      wsRef.current.sendTyping();
    }
  }, []);

  // Limpar mensagens
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-conectar ao montar
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Desconectar ao desmontar
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    connected,
    messages,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    clearMessages,
  };
};
