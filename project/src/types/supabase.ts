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
      contact_messages: {
        Row: {
          id: number
          created_at: string
          first_name: string
          last_name: string
          email: string
          service: string
          message: string
          status: 'new' | 'read' | 'replied'
        }
        Insert: {
          id?: number
          created_at?: string
          first_name: string
          last_name: string
          email: string
          service: string
          message: string
          status?: 'new' | 'read' | 'replied'
        }
        Update: {
          id?: number
          created_at?: string
          first_name?: string
          last_name?: string
          email?: string
          service?: string
          message?: string
          status?: 'new' | 'read' | 'replied'
        }
      }
      stats: {
        Row: {
          id: number
          created_at: string
          daily_usage: number
          sun_hours: number
          backup_days: number
          efficiency: number
          solar_size: number
          battery_size: number
          inverter_size: number
        }
        Insert: {
          id?: number
          created_at?: string
          daily_usage: number
          sun_hours: number
          backup_days: number
          efficiency: number
          solar_size: number
          battery_size: number
          inverter_size: number
        }
        Update: {
          id?: number
          created_at?: string
          daily_usage?: number
          sun_hours?: number
          backup_days?: number
          efficiency?: number
          solar_size?: number
          battery_size?: number
          inverter_size?: number
        }
      }
    }
  }
}