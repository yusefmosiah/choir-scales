export interface ChorusResponse {
    step: string;
    content: string;
    sources?: Source[];
    error?: string;
  }

  export interface Source {
    id: string;
    content: string;
    created_at?: string;
    agent?: string;
    token_value?: number;
    similarity?: number;
  }

  export interface User {
    id: string;
    public_key: string;
    created_at: string;
  }

  export interface ChatThread {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    messages: string[];
  }
