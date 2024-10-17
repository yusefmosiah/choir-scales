export interface ChorusResponse {
  type?: 'chorus_response';
  step?: string;
  content?: string;
  sources?: Source[];
  error?: string;
  messages?: Array<{ id?: string; role: string; content: string }>;
}

export interface ThreadMessagesResponse {
  type: 'thread_messages';
  thread_id: string;
  messages: Message[];
}

export interface NewThreadResponse {
  type: 'new_thread';
  chat_thread: ChatThread;
}

export interface InitResponse {
  type: 'init';
  user: User;
  chat_threads: ChatThread[];
}

export interface ErrorResponse {
  type: 'error';
  error: string;
}

export type WebSocketResponse =
  | ChorusResponse
  | ThreadMessagesResponse
  | NewThreadResponse
  | InitResponse
  | ErrorResponse;

export interface Source extends Message {
  similarity: number;
}

export interface User {
  id: string;
  public_key: string;
  created_at: string;
  chat_threads: string[];
}

export interface ChatThread {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  messages: string[];
}

export interface Message {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  step?: string;
  token_value?: number;
}
