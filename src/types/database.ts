/** Hand-written types — data agent may extend after migrations land. */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      calculator_history: {
        Row: {
          id: string;
          user_id: string;
          expression: string;
          result: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          expression: string;
          result: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          expression?: string;
          result?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CalculatorHistoryEntry =
  Database["public"]["Tables"]["calculator_history"]["Row"];
