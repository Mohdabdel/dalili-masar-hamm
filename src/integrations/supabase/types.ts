export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      active_participations: {
        Row: {
          closed_at: string | null
          completed_at: string | null
          completion_source: string | null
          created_at: string
          daily_event_id: string | null
          id: string
          notes: string | null
          opportunity_id: string
          routine_station_id: string | null
          source: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          completed_at?: string | null
          completion_source?: string | null
          created_at?: string
          daily_event_id?: string | null
          id?: string
          notes?: string | null
          opportunity_id: string
          routine_station_id?: string | null
          source?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          closed_at?: string | null
          completed_at?: string | null
          completion_source?: string | null
          created_at?: string
          daily_event_id?: string | null
          id?: string
          notes?: string | null
          opportunity_id?: string
          routine_station_id?: string | null
          source?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_participations_routine_station_id_fkey"
            columns: ["routine_station_id"]
            isOneToOne: false
            referencedRelation: "routine_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      family_routines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learner_card_customizations: {
        Row: {
          created_at: string
          id: string
          intro_note: string | null
          opportunity_id: string
          settings: Json
          title_override: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intro_note?: string | null
          opportunity_id: string
          settings?: Json
          title_override?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          intro_note?: string | null
          opportunity_id?: string
          settings?: Json
          title_override?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learner_card_exports: {
        Row: {
          created_at: string
          customization_id: string | null
          expires_at: string | null
          format: string
          id: string
          opportunity_id: string | null
          storage_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customization_id?: string | null
          expires_at?: string | null
          format?: string
          id?: string
          opportunity_id?: string | null
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          customization_id?: string | null
          expires_at?: string | null
          format?: string
          id?: string
          opportunity_id?: string | null
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_card_exports_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "learner_card_customizations"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_card_steps: {
        Row: {
          canonical_asset_code: string | null
          created_at: string
          customization_id: string
          id: string
          is_hidden: boolean
          position: number
          text: string
          updated_at: string
          user_id: string
          visual_asset_id: string | null
        }
        Insert: {
          canonical_asset_code?: string | null
          created_at?: string
          customization_id: string
          id?: string
          is_hidden?: boolean
          position?: number
          text: string
          updated_at?: string
          user_id?: string
          visual_asset_id?: string | null
        }
        Update: {
          canonical_asset_code?: string | null
          created_at?: string
          customization_id?: string
          id?: string
          is_hidden?: boolean
          position?: number
          text?: string
          updated_at?: string
          user_id?: string
          visual_asset_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learner_card_steps_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "learner_card_customizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learner_card_steps_visual_asset_id_fkey"
            columns: ["visual_asset_id"]
            isOneToOne: false
            referencedRelation: "visual_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      participation_daily_logs: {
        Row: {
          active_participation_id: string
          created_at: string
          did_participate: boolean
          id: string
          log_date: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_participation_id: string
          created_at?: string
          did_participate?: boolean
          id?: string
          log_date: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          active_participation_id?: string
          created_at?: string
          did_participate?: boolean
          id?: string
          log_date?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participation_daily_logs_active_participation_id_fkey"
            columns: ["active_participation_id"]
            isOneToOne: false
            referencedRelation: "active_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      participation_snapshots: {
        Row: {
          approved_at: string
          created_at: string
          created_by: string | null
          family_participation_id: string
          id: string
          schema_version: number
          snapshot_data: Json
          user_id: string
          version_number: number
        }
        Insert: {
          approved_at?: string
          created_at?: string
          created_by?: string | null
          family_participation_id: string
          id?: string
          schema_version?: number
          snapshot_data: Json
          user_id?: string
          version_number: number
        }
        Update: {
          approved_at?: string
          created_at?: string
          created_by?: string | null
          family_participation_id?: string
          id?: string
          schema_version?: number
          snapshot_data?: Json
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "participation_snapshots_family_participation_id_fkey"
            columns: ["family_participation_id"]
            isOneToOne: false
            referencedRelation: "active_participations"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_attachments: {
        Row: {
          created_at: string
          external_url: string | null
          id: string
          label: string | null
          ref_id: string
          scope: string
          updated_at: string
          user_id: string
          visual_asset_id: string | null
        }
        Insert: {
          created_at?: string
          external_url?: string | null
          id?: string
          label?: string | null
          ref_id: string
          scope?: string
          updated_at?: string
          user_id?: string
          visual_asset_id?: string | null
        }
        Update: {
          created_at?: string
          external_url?: string | null
          id?: string
          label?: string | null
          ref_id?: string
          scope?: string
          updated_at?: string
          user_id?: string
          visual_asset_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_attachments_visual_asset_id_fkey"
            columns: ["visual_asset_id"]
            isOneToOne: false
            referencedRelation: "visual_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_stations: {
        Row: {
          completed_at: string | null
          created_at: string
          daily_event_id: string
          domain_id: string | null
          id: string
          label: string | null
          part_of_day: string
          position: number
          routine_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          daily_event_id: string
          domain_id?: string | null
          id?: string
          label?: string | null
          part_of_day?: string
          position?: number
          routine_id: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          daily_event_id?: string
          domain_id?: string | null
          id?: string
          label?: string | null
          part_of_day?: string
          position?: number
          routine_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_stations_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "family_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      visual_assets: {
        Row: {
          created_at: string
          height: number | null
          id: string
          label: string | null
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          label?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          label?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
