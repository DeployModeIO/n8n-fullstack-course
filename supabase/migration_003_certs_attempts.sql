-- ============================================================
-- MIGRATION 003: Intentos del curso + Certificados
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- Control de intentos del curso (3 intentos, luego bloqueo)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL DEFAULT 'n8n-fullstack',
  attempts_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  blocked BOOLEAN NOT NULL DEFAULT false,
  certificate_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Certificados emitidos (verificables via Accredible / Sertifier)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL DEFAULT 'n8n-fullstack',
  provider TEXT NOT NULL,
  credential_id TEXT,
  certificate_no TEXT,
  verification_url TEXT,
  pdf_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

-- Función auxiliar: registrar/obtener inscripción
CREATE OR REPLACE FUNCTION public.ensure_enrollment(p_user_id UUID, p_course_id TEXT DEFAULT 'n8n-fullstack')
RETURNS public.enrollments
LANGUAGE plpgsql
AS $$
DECLARE
  v_enrollment public.enrollments;
BEGIN
  INSERT INTO public.enrollments (user_id, course_id)
  VALUES (p_user_id, p_course_id)
  ON CONFLICT (user_id, course_id) DO NOTHING;

  SELECT * INTO v_enrollment
  FROM public.enrollments
  WHERE user_id = p_user_id AND course_id = p_course_id;

  RETURN v_enrollment;
END;
$$;
