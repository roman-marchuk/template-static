/** Hand-written types aligned with Supabase migrations. */

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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "calculator_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CalculatorHistoryEntry =
  Database["public"]["Tables"]["calculator_history"]["Row"];
