// ==============================================================================
// Tipos de Base de Datos para Supabase (Ecosistema Institucional Docencia UDP)
// Esquema Normalizado 3NF/BCNF de Alta Escalabilidad
// ==============================================================================

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
      institutions: {
        Row: {
          id: string;
          code: string;
          name: string;
          domain: string;
          canvas_base_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          domain: string;
          canvas_base_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          domain?: string;
          canvas_base_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      faculties: {
        Row: {
          id: string;
          institution_id: string;
          code: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          code: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          code?: string;
          name?: string;
          updated_at?: string;
        };
      };
      academic_programs: {
        Row: {
          id: string;
          faculty_id: string;
          code: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          faculty_id: string;
          code: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          faculty_id?: string;
          code?: string;
          name?: string;
          updated_at?: string;
        };
      };
      academic_terms: {
        Row: {
          id: string;
          institution_id: string;
          code: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          code: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string;
          code?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          institution_id: string | null;
          program_id: string | null;
          canvas_course_id: number;
          code: string;
          name: string;
          term: string;
          term_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id?: string | null;
          program_id?: string | null;
          canvas_course_id: number;
          code: string;
          name: string;
          term?: string;
          term_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          institution_id?: string | null;
          program_id?: string | null;
          canvas_course_id?: number;
          code?: string;
          name?: string;
          term?: string;
          term_id?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          course_id: string;
          canvas_section_id: number | null;
          code: string;
          name: string;
          teacher_name: string | null;
          teacher_email: string | null;
          assistant_name: string | null;
          assistant_email: string | null;
          horario_catedra_dias: number[];
          horario_catedra_inicio: string;
          horario_catedra_fin: string;
          horario_catedra_sala: string;
          horario_ayudantia_dias: number[];
          horario_ayudantia_inicio: string;
          horario_ayudantia_fin: string;
          horario_ayudantia_sala: string;
          pin_activo: string;
          requiere_pin: boolean;
          requiere_geo: boolean;
          incluir_ayudantias_en_final: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          canvas_section_id?: number | null;
          code: string;
          name: string;
          teacher_name?: string | null;
          teacher_email?: string | null;
          assistant_name?: string | null;
          assistant_email?: string | null;
          horario_catedra_dias?: number[];
          horario_catedra_inicio?: string;
          horario_catedra_fin?: string;
          horario_catedra_sala?: string;
          horario_ayudantia_dias?: number[];
          horario_ayudantia_inicio?: string;
          horario_ayudantia_fin?: string;
          horario_ayudantia_sala?: string;
          pin_activo?: string;
          requiere_pin?: boolean;
          requiere_geo?: boolean;
          incluir_ayudantias_en_final?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          canvas_section_id?: number | null;
          code?: string;
          name?: string;
          teacher_name?: string | null;
          teacher_email?: string | null;
          assistant_name?: string | null;
          assistant_email?: string | null;
          horario_catedra_dias?: number[];
          horario_catedra_inicio?: string;
          horario_catedra_fin?: string;
          horario_catedra_sala?: string;
          horario_ayudantia_dias?: number[];
          horario_ayudantia_inicio?: string;
          horario_ayudantia_fin?: string;
          horario_ayudantia_sala?: string;
          pin_activo?: string;
          requiere_pin?: boolean;
          requiere_geo?: boolean;
          incluir_ayudantias_en_final?: boolean;
          updated_at?: string;
        };
      };
      section_schedules: {
        Row: {
          id: string;
          section_id: string;
          type: "catedra" | "ayudantia" | "laboratorio" | "taller";
          day_of_week: number;
          start_time: string;
          end_time: string;
          room: string | null;
          building: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          type: "catedra" | "ayudantia" | "laboratorio" | "taller";
          day_of_week: number;
          start_time: string;
          end_time: string;
          room?: string | null;
          building?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          type?: "catedra" | "ayudantia" | "laboratorio" | "taller";
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          room?: string | null;
          building?: string | null;
        };
      };
      students: {
        Row: {
          id: string;
          canvas_id: number;
          rut: string;
          nombres: string;
          apellidos: string;
          email: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          canvas_id: number;
          rut: string;
          nombres: string;
          apellidos: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          canvas_id?: number;
          rut?: string;
          nombres?: string;
          apellidos?: string;
          email?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          section_id: string;
          student_id: string;
          role: "student" | "assistant" | "teacher" | "observer";
          status: "active" | "withdrawn" | "suspended";
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          student_id: string;
          role?: "student" | "assistant" | "teacher" | "observer";
          status?: "active" | "withdrawn" | "suspended";
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          student_id?: string;
          role?: "student" | "assistant" | "teacher" | "observer";
          status?: "active" | "withdrawn" | "suspended";
        };
      };
      class_sessions: {
        Row: {
          id: string;
          section_id: string;
          session_code: string | null;
          date: string;
          dia_semana: string;
          type: "catedra" | "ayudantia" | "laboratorio";
          modality: "presencial" | "online";
          status: "programada" | "en_curso" | "realizada" | "cancelada";
          motivo_cancelacion: string | null;
          start_time: string | null;
          end_time: string | null;
          room: string | null;
          pin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          session_code?: string | null;
          date: string;
          dia_semana: string;
          type: "catedra" | "ayudantia" | "laboratorio";
          modality?: "presencial" | "online";
          status?: "programada" | "en_curso" | "realizada" | "cancelada";
          motivo_cancelacion?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          room?: string | null;
          pin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          session_code?: string | null;
          date?: string;
          dia_semana?: string;
          type?: "catedra" | "ayudantia" | "laboratorio";
          modality?: "presencial" | "online";
          status?: "programada" | "en_curso" | "realizada" | "cancelada";
          motivo_cancelacion?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          room?: string | null;
          pin?: string | null;
          updated_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          value: 0 | 1;
          marked_by: "profesor" | "ayudante" | "alumno_pin" | "sistema";
          marked_at: string;
          ip_address: string | null;
          latitude: number | null;
          longitude: number | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          value: 0 | 1;
          marked_by?: "profesor" | "ayudante" | "alumno_pin" | "sistema";
          marked_at?: string;
          ip_address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          value?: 0 | 1;
          marked_by?: "profesor" | "ayudante" | "alumno_pin" | "sistema";
          marked_at?: string;
          ip_address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
        };
      };
      student_work_records: {
        Row: {
          id: string;
          section_id: string;
          student_id: string;
          decimas_acumuladas: number;
          trabajos_realizados: number;
          observaciones: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          student_id: string;
          decimas_acumuladas?: number;
          trabajos_realizados?: number;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          student_id?: string;
          decimas_acumuladas?: number;
          trabajos_realizados?: number;
          observaciones?: string | null;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          description: string | null;
          type: "taller_ayudantia" | "control" | "preparacion_solemne" | "tarea";
          max_decimas: number;
          due_date: string | null;
          rubric_json: Json | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          description?: string | null;
          type?: "taller_ayudantia" | "control" | "preparacion_solemne" | "tarea";
          max_decimas?: number;
          due_date?: string | null;
          rubric_json?: Json | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          description?: string | null;
          type?: "taller_ayudantia" | "control" | "preparacion_solemne" | "tarea";
          max_decimas?: number;
          due_date?: string | null;
          rubric_json?: Json | null;
          is_published?: boolean;
          updated_at?: string;
        };
      };
      activity_submissions: {
        Row: {
          id: string;
          activity_id: string;
          student_id: string;
          status: "pendiente" | "entregado" | "corregido" | "tardio";
          decimas_obtained: number;
          feedback_text: string | null;
          evaluated_by: string;
          evaluated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          student_id: string;
          status?: "pendiente" | "entregado" | "corregido" | "tardio";
          decimas_obtained?: number;
          feedback_text?: string | null;
          evaluated_by?: string;
          evaluated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          activity_id?: string;
          student_id?: string;
          status?: "pendiente" | "entregado" | "corregido" | "tardio";
          decimas_obtained?: number;
          feedback_text?: string | null;
          evaluated_by?: string;
          evaluated_at?: string | null;
          updated_at?: string;
        };
      };
      attendance_audit_logs: {
        Row: {
          id: string;
          session_id: string;
          student_id: string;
          previous_value: number | null;
          new_value: number;
          reason: string | null;
          changed_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          student_id: string;
          previous_value?: number | null;
          new_value: number;
          reason?: string | null;
          changed_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          student_id?: string;
          previous_value?: number | null;
          new_value?: number;
          reason?: string | null;
          changed_by?: string;
        };
      };
    };
    Views: {
      v_student_attendance_summary: {
        Row: {
          section_id: string;
          student_id: string;
          canvas_id: number;
          rut: string;
          nombres: string;
          apellidos: string;
          email: string;
          decimas_acumuladas: number;
          trabajos_realizados: number;
          catedras_asistidas: number;
          catedras_validas: number;
          catedras_pct: number;
          ayudantias_asistidas: number;
          ayudantias_validas: number;
          ayudantias_pct: number;
          total_asistidas: number;
          total_validas: number;
          total_pct: number;
        };
      };
    };
    Functions: {
      upsert_attendance_batch: {
        Args: {
          records_json: Json;
        };
        Returns: void;
      };
      upsert_attendance_by_code: {
        Args: {
          p_session_code: string;
          p_student_canvas_id: number;
          p_value: number;
          p_marked_by?: string;
        };
        Returns: void;
      };
      upsert_attendance_batch_by_codes: {
        Args: {
          records_json: Json;
        };
        Returns: void;
      };
      get_section_attendance_map: {
        Args: {
          p_section_code: string;
        };
        Returns: {
          session_code: string;
          student_canvas_id: number;
          value: number;
        }[];
      };
      upsert_student_work_record: {
        Args: {
          p_section_code: string;
          p_student_canvas_id: number;
          p_decimas: number;
          p_trabajos: number;
        };
        Returns: void;
      };
      get_section_work_records: {
        Args: {
          p_section_code: string;
        };
        Returns: {
          student_canvas_id: number;
          decimas_acumuladas: number;
          trabajos_realizados: number;
        }[];
      };
    };
  };
}
