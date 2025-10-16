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
      countries: {
        Row: {
          id: string
          name: string
          iso_code: string
          iso3_code: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['countries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['countries']['Insert']>
      }
      brands: {
        Row: {
          id: string
          brand: string
          verified: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['brands']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['brands']['Insert']>
      }
      models: {
        Row: {
          id: string
          brand_id: string
          model: string
          verified: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['models']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['models']['Insert']>
      }
      model_versions: {
        Row: {
          id: string
          model_id: string
          version: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['model_versions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['model_versions']['Insert']>
      }
      fuels: {
        Row: {
          id: string
          name: string
          type: string | null
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['fuels']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['fuels']['Insert']>
      }
      vehicle_categories: {
        Row: {
          id: string
          category: string
          description: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicle_categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicle_categories']['Insert']>
      }
      plate_types: {
        Row: {
          id: string
          country_id: string
          name: string
          description: string | null
          format_pattern: string | null
          valid_from: string | null
          valid_until: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['plate_types']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['plate_types']['Insert']>
      }
      vehicles: {
        Row: {
          id: string
          brand_id: string
          model_id: string
          version_id: string | null
          category_id: string
          chassis: string
          model_year: number
          manufacture_year: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>
      }
      vehicle_registrations: {
        Row: {
          id: string
          vehicle_id: string
          country_id: string
          registration_number: string
          registration_type: string
          start_date: string
          end_date: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicle_registrations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicle_registrations']['Insert']>
      }
      plates: {
        Row: {
          id: string
          vehicle_id: string
          plate_type_id: string
          plate: string
          state: string | null
          licensing_country_id: string
          start_date: string
          end_date: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['plates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['plates']['Insert']>
      }
      colors: {
        Row: {
          id: string
          vehicle_id: string
          color: string
          start_date: string
          end_date: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['colors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['colors']['Insert']>
      }
      vehicle_fuels: {
        Row: {
          id: string
          vehicle_id: string
          fuel_id: string
          start_date: string
          end_date: string | null
          active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicle_fuels']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicle_fuels']['Insert']>
      }
      entities: {
        Row: {
          id: string
          entity_type: 'person' | 'ai_agent' | 'iot_device' | 'organization' | 'robot'
          name: string
          email: string | null
          phone: string | null
          document_number: string | null
          ai_model: string | null
          ai_capabilities: Json | null
          device_serial: string | null
          device_type: string | null
          legal_id: string | null
          organization_type: string | null
          auth_user_id: string | null
          metadata: Json | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['entities']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['entities']['Insert']>
      }
      vehicle_entity_links: {
        Row: {
          id: string
          vehicle_id: string
          entity_id: string
          relationship_type: 'owner' | 'co_owner' | 'renter' | 'authorized_driver' | 'ai_assistant' | 'monitoring_device' | 'maintenance_robot' | 'fleet_manager' | 'emergency_contact' | 'insurance_company'
          permissions: Json
          status: 'active' | 'suspended' | 'terminated' | 'pending'
          start_date: string
          end_date: string | null
          notes: string | null
          created_by: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicle_entity_links']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vehicle_entity_links']['Insert']>
      }
      moments: {
        Row: {
          id: string
          vehicle_id: string
          entity_id: string
          caption: string | null
          type: 'image' | 'video' | 'text'
          location: string | null
          tags: Json
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['moments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['moments']['Insert']>
      }
      moment_images: {
        Row: {
          id: string
          moment_id: string
          image_url: string
          image_order: number
          width: number | null
          height: number | null
          size_bytes: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['moment_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['moment_images']['Insert']>
      }
      moment_reactions: {
        Row: {
          id: string
          moment_id: string
          entity_id: string
          reaction_type: 'like' | 'love' | 'care' | 'wow' | 'sad' | 'angry'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['moment_reactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['moment_reactions']['Insert']>
      }
      moment_comments: {
        Row: {
          id: string
          moment_id: string
          entity_id: string
          comment: string
          parent_comment_id: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['moment_comments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['moment_comments']['Insert']>
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          image_url: string
          is_primary: boolean
          width: number | null
          height: number | null
          size_bytes: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vehicle_images']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vehicle_images']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// Helper types for common queries
export type VehicleWithDetails = Database['public']['Tables']['vehicles']['Row'] & {
  brands: Database['public']['Tables']['brands']['Row']
  models: Database['public']['Tables']['models']['Row']
  model_versions: Database['public']['Tables']['model_versions']['Row'] | null
  vehicle_categories: Database['public']['Tables']['vehicle_categories']['Row']
  plates: Database['public']['Tables']['plates']['Row'][]
  colors: Database['public']['Tables']['colors']['Row'][]
  vehicle_fuels: (Database['public']['Tables']['vehicle_fuels']['Row'] & {
    fuels: Database['public']['Tables']['fuels']['Row']
  })[]
}

export type MomentWithDetails = Database['public']['Tables']['moments']['Row'] & {
  vehicles: Database['public']['Tables']['vehicles']['Row'] & {
    brands: Database['public']['Tables']['brands']['Row']
    models: Database['public']['Tables']['models']['Row']
    model_versions: Database['public']['Tables']['model_versions']['Row'] | null
  }
  entities: Database['public']['Tables']['entities']['Row']
  moment_images: Database['public']['Tables']['moment_images']['Row'][]
  moment_reactions: (Database['public']['Tables']['moment_reactions']['Row'] & {
    entities: Database['public']['Tables']['entities']['Row']
  })[]
  moment_comments: (Database['public']['Tables']['moment_comments']['Row'] & {
    entities: Database['public']['Tables']['entities']['Row']
  })[]
}
