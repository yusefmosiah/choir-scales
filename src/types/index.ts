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
