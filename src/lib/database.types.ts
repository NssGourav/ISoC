export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          description: string | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          description?: string | null
        }
      }
      students: {
        Row: {
          id: string
          created_at: string
          full_name: string
          email: string
        }
        Insert: {
          id: string
          created_at?: string
          full_name: string
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          email?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}