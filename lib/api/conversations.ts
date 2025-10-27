import { api } from './config';

export interface Conversation {
  id: string;
  vehicle_id: string;
  entity_id: string;
  title: string | null;
  status: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
  metadata: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_type: string;
  content: string | null;
  media_urls: any[];
  metadata: any;
  status: string;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
  reply_to_message_id: string | null;
  reactions: any[];
  edited: boolean;
  edited_at: string | null;
  deleted: boolean;
  deleted_at: string | null;
  created_at: string;
}

export const conversationsService = {
  async getAll(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/conversations');
    return response.data;
  },

  async getById(id: string): Promise<Conversation> {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  async sendMessage(conversationId: string, content: string, type: string = 'text'): Promise<Message> {
    const response = await api.post<Message>(`/conversations/${conversationId}/messages`, {
      content,
      message_type: type,
    });
    return response.data;
  },
};
