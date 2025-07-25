export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      Land: {
        Row: {
          id: number
          created_at: string
          parcel_id: number
          size: number
          ownership_type: string
          supporting_documents: string
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          parcel_id: number
          size: number
          ownership_type: string
          supporting_documents: string
          status: string
        }
        Update: {
          id?: number
          created_at?: string
          parcel_id?: number
          size?: number
          ownership_type?: string
          supporting_documents?: string
          status?: string
        }
      }
      transfers: {
        Row: {
          id: number
          created_at: string
          recipient_name: string
          contract_document: string
          status: string
          parcel_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          recipient_name: string
          contract_document: string
          status: string
          parcel_id: string
        }
        Update: {
          id?: number
          created_at?: string
          recipient_name?: string
          contract_document?: string
          status?: string
          parcel_id?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
