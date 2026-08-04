# Curso Full Stack de N8N

Plataforma educativa para el curso completo de automatización con N8N, construida con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## Requisitos

- Node.js 18+
- npm o pnpm

## Instalación

```bash
git clone <repositorio>
cd n8n-fullstack-course
npm install
```

## Configuración

Copia el archivo de ejemplo y rellena tus credenciales de Supabase:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tu URL de proyecto Supabase, la clave anónima y la clave de servicio.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel

1. Conecta este repositorio en [vercel.com](https://vercel.com).
2. Añade las variables de entorno desde el panel de Vercel (mismas claves que `.env.local`).
3. El despliegue se ejecuta automáticamente en cada push a `main`.
