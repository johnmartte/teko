# TEKO — Guia de Backend para el Portal de Clientes

Este documento describe la arquitectura de backend sugerida para el portal de clientes de TEKO. El frontend ya esta construido con datos mock y espera que el backend implemente exactamente las interfaces definidas en `shared/portal-types.ts`.

---

## Stack Sugerido

| Componente | Tecnologia | Razon |
|------------|-----------|-------|
| Runtime | Node.js 20+ | Ecosistema compartido con el frontend Next.js |
| Framework | Express.js o Fastify | Ligero, bien documentado, rapido de implementar |
| Base de datos | PostgreSQL 16+ | Relacional, robusto, soporte JSON nativo |
| ORM | Prisma | Type-safe, migraciones, generacion de tipos |
| Auth | JWT (access + refresh tokens) | Stateless, escalable, estandar de la industria |
| File storage | AWS S3 o Cloudflare R2 | Archivos de entregables y facturas PDF |
| Email | Resend o SendGrid | Notificaciones por email (opcional) |

---

## Flujo de Autenticacion

### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { data: { user: User, tokens: AuthTokens }, success: true }
```

### Tokens
- **Access Token**: JWT, expira en **15 minutos**, enviado en header `Authorization: Bearer <token>`
- **Refresh Token**: JWT, expira en **7 dias**, almacenado en cookie `httpOnly`, `secure`, `sameSite: strict`
- El frontend almacena el access token en memoria (no localStorage)

### Refresh
```
POST /api/auth/refresh
Cookie: refreshToken=<token>
Response: { data: { accessToken: string, expiresAt: string }, success: true }
```

### Logout
```
POST /api/auth/logout
→ Invalida el refresh token en la base de datos
```

### Middleware de Proteccion
Todas las rutas `/api/portal/*` requieren un access token valido. El middleware:
1. Extrae el token del header `Authorization: Bearer <token>`
2. Verifica firma y expiracion
3. Adjunta `req.user` con `{ id, email, role }`
4. Si es invalido/expirado → responde `401`

---

## API Endpoints

### Auth
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | `/api/auth/login` | Autenticar cliente |
| POST | `/api/auth/refresh` | Renovar access token |
| POST | `/api/auth/logout` | Cerrar sesion |

### Portal (requiere auth)
| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | `/api/portal/me` | Obtener perfil del usuario autenticado |
| PATCH | `/api/portal/me` | Actualizar perfil (nombre, telefono) |
| GET | `/api/portal/dashboard` | Resumen del dashboard (conteos, actividad reciente) |
| GET | `/api/portal/projects` | Listar proyectos del cliente (paginado) |
| GET | `/api/portal/projects/:id` | Detalle de proyecto con hitos, entregables y equipo |
| GET | `/api/portal/meetings` | Listar reuniones (query: `?status=programada\|completada\|cancelada`) |
| GET | `/api/portal/files` | Listar archivos compartidos (query: `?projectId=xxx`) |
| GET | `/api/portal/files/:id/download` | Redirige a URL firmada de S3/R2 |
| GET | `/api/portal/invoices` | Listar facturas (query: `?status=pagada\|pendiente\|vencida`) |
| GET | `/api/portal/invoices/:id/pdf` | Descargar factura en PDF |
| GET | `/api/portal/notifications` | Listar notificaciones (paginado) |
| PATCH | `/api/portal/notifications/:id/read` | Marcar notificacion como leida |
| POST | `/api/portal/notifications/read-all` | Marcar todas como leidas |

---

## Formato de Respuestas

### Respuesta exitosa
```json
{
  "data": { ... },
  "success": true,
  "message": "Operacion exitosa"
}
```

### Respuesta paginada
```json
{
  "data": [ ... ],
  "total": 25,
  "page": 1,
  "pageSize": 10,
  "totalPages": 3
}
```

### Respuesta de error
```json
{
  "success": false,
  "message": "Descripcion del error",
  "errors": [
    { "field": "email", "message": "Email es requerido" }
  ]
}
```

### Convenciones
- **Fechas**: ISO 8601 (`2025-05-20T08:00:00Z`)
- **IDs**: UUIDs (`usr_001`, `proj_001`, etc. — en produccion usar UUIDv4)
- **Montos**: numeros enteros o decimales, NO strings
- **HTTP Status**: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error

---

## Schema de Base de Datos (PostgreSQL)

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE project_status AS ENUM ('en_progreso', 'en_revision', 'completado', 'pausado', 'cancelado');
CREATE TYPE milestone_status AS ENUM ('completado', 'en_progreso', 'pendiente');
CREATE TYPE deliverable_status AS ENUM ('entregado', 'en_revision', 'aprobado', 'pendiente');
CREATE TYPE meeting_status AS ENUM ('programada', 'completada', 'cancelada');
CREATE TYPE meeting_platform AS ENUM ('zoom', 'google_meet', 'teams', 'presencial');
CREATE TYPE invoice_status AS ENUM ('pagada', 'pendiente', 'vencida', 'cancelada');
CREATE TYPE invoice_currency AS ENUM ('USD', 'DOP');
CREATE TYPE notification_type AS ENUM (
  'milestone_completed', 'deliverable_uploaded', 'meeting_scheduled',
  'invoice_issued', 'message_received', 'project_status_changed'
);

-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(200),
  phone VARCHAR(50),
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(300) NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'en_progreso',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  thumbnail_url TEXT,
  category VARCHAR(100),
  client_id UUID NOT NULL REFERENCES users(id),
  start_date DATE NOT NULL,
  estimated_end_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_client ON projects(client_id);

-- Miembros del equipo (staff interno TEKO)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  role VARCHAR(200) NOT NULL,
  avatar_url TEXT
);

-- Relacion proyecto-equipo
CREATE TABLE project_team (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, team_member_id)
);

-- Hitos
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  status milestone_status NOT NULL DEFAULT 'pendiente',
  due_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_milestones_project ON milestones(project_id);

-- Entregables
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50),
  file_size_bytes BIGINT DEFAULT 0,
  status deliverable_status NOT NULL DEFAULT 'pendiente',
  uploaded_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_deliverables_milestone ON deliverables(milestone_id);

-- Reuniones
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  platform meeting_platform NOT NULL DEFAULT 'zoom',
  meeting_url TEXT,
  status meeting_status NOT NULL DEFAULT 'programada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_meetings_project ON meetings(project_id);
CREATE INDEX idx_meetings_date ON meetings(date);

-- Asistentes a reuniones
CREATE TABLE meeting_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(200),
  avatar_url TEXT
);

-- Facturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id),
  issued_at DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  amount DECIMAL(12, 2) NOT NULL,
  currency invoice_currency NOT NULL DEFAULT 'USD',
  status invoice_status NOT NULL DEFAULT 'pendiente',
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoices_project ON invoices(project_id);

-- Items de factura
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL
);

-- Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(300) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  project_id UUID REFERENCES projects(id),
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- Archivos compartidos
CREATE TABLE shared_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  file_type VARCHAR(50),
  file_size_bytes BIGINT DEFAULT 0,
  url TEXT NOT NULL,
  uploaded_by VARCHAR(200),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_shared_files_project ON shared_files(project_id);
```

---

## Contrato Frontend-Backend

**El archivo `shared/portal-types.ts` es la fuente de verdad.** El backend DEBE retornar objetos que coincidan exactamente con las interfaces definidas ahi. Campos clave:

- `User.id` → string (UUID)
- `Project.progress` → number 0-100
- `Project.milestones` → array incluido en la respuesta de detalle, NO endpoint separado
- `Project.deliverables` → idem
- `Project.team` → idem
- `Meeting.projectName` → incluido en la respuesta (join con projects)
- `Invoice.items` → incluido en la respuesta
- `SharedFile.projectName` → incluido en la respuesta (join con projects)

---

## Notas Adicionales

1. **Passwords**: Hashear con bcrypt (cost factor 12+)
2. **CORS**: Configurar para permitir el dominio del frontend
3. **Rate limiting**: Aplicar en endpoints de auth (max 5 intentos/min por IP)
4. **Validacion**: Usar Zod para validar request bodies (similar al frontend)
5. **Seed data**: Crear un script de seed que inserte los datos mock para testing
6. **Variables de entorno necesarias**:
   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/teko_portal
   JWT_SECRET=<secret-32-chars-min>
   JWT_REFRESH_SECRET=<another-secret>
   S3_BUCKET=teko-files
   S3_REGION=us-east-1
   S3_ACCESS_KEY=...
   S3_SECRET_KEY=...
   ```
