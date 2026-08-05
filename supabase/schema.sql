-- ============================================================
-- MIGRATION: Eliminar Supabase Auth, usar auth propio
-- Ejecutar esto en Supabase SQL Editor (panel existente)
-- ============================================================

-- 1. Eliminar trigger y funcion que sincronizaban auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Eliminar FK de public.users.id -> auth.users.id
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 3. Agregar columna password_hash
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 4. Eliminar funcion RPC auxiliar (ya no se necesita)
DROP FUNCTION IF EXISTS public.get_user_id_by_email(TEXT);

-- 5. Crear o actualizar el usuario admin con contraseña hasheada
-- Contraseña: AdminN8N2026!  (cambiar despues del primer login)
INSERT INTO public.users (id, email, role, password_hash, created_at)
VALUES (
  gen_random_uuid(),
  'luisriverosu@gmail.com',
  'admin',
  '$2b$10$RGl5L2SFMniYMK5PSrWFWeu.iJikKH/7kKURTmB12KoLv5QGCwWBu',
  now()
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = 'admin';

-- ============================================================
-- SCHEMA COMPLETO (referencia / instalaciones nuevas)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  n8n_workflow_json JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 15,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, slug)
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  answers JSONB,
  passed BOOLEAN DEFAULT false,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT,
  content JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  invited_by UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);
