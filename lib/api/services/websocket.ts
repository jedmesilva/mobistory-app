import { WS_BASE_URL, tokenManager } from '../config';
import type { WebSocketMessage } from '../types';

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private conversationId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private shouldReconnect = true;

  constructor(conversationId: string) {
    this.conversationId = conversationId;
  }

  /**
   * Conectar ao WebSocket
   */
  async connect(): Promise<void> {
    const token = await tokenManager.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `${WS_BASE_URL}/chat/ws/${this.conversationId}?token=${token}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.notifyMessageHandlers(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.notifyConnectionHandlers(false);

      if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnect();
      }
    };
  }

  /**
   * Reconectar após desconexão
   */
  private reconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  /**
   * Enviar mensagem
   */
  sendMessage(content: string, messageType: 'text' | 'voice' | 'image' = 'text', contextHint?: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message = {
      type: 'message',
      content,
      message_type: messageType,
      context_hint: contextHint,
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Enviar indicador de "está digitando"
   */
  sendTyping(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: 'typing',
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * Adicionar handler para mensagens recebidas
   */
  onMessage(handler: (message: WebSocketMessage) => void): () => void {
    this.messageHandlers.push(handler);

    // Retornar função para remover handler
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * Adicionar handler para mudanças de conexão
   */
  onConnection(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);

    // Retornar função para remover handler
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter((h) => h !== handler);
    };
  }

  /**
   * Notificar handlers de mensagem
   */
  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  /**
   * Notificar handlers de conexão
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  /**
   * Desconectar
   */
  disconnect(): void {
    this.shouldReconnect = false;

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.messageHandlers = [];
    this.connectionHandlers = [];
  }

  /**
   * Verificar se está conectado
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * Factory para criar instâncias do WebSocket
 */
export const createChatWebSocket = (conversationId: string): ChatWebSocket => {
  return new ChatWebSocket(conversationId);
};
