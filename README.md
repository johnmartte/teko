# TEKO - Sitio Comercial y Catalogo de Servicios

Sitio web corporativo desarrollado con Next.js (App Router) para presentar los servicios digitales de TEKO, su proceso de trabajo y su catalogo por fases.

Este repositorio contiene la capa de presentacion (frontend), una estructura de componentes reutilizables y una organizacion basada en datos para escalar el contenido de servicios sin acoplar todo a una sola vista.

## Resumen del Proyecto

TEKO esta orientado a mostrar, de forma clara y visual, una oferta de transformacion digital que incluye:

- Branding e identidad visual.
- Desarrollo web y software.
- Infraestructura cloud.
- Microservicios para emprendimientos.

La experiencia esta construida con enfoque responsive, componentes reutilizables y estilos modernos con Tailwind CSS v4.

## Stack Tecnologico

- Next.js 16.2.2 (App Router)
- React 19.2.4
- TypeScript 5 (modo estricto)
- Tailwind CSS v4
- ESLint 9 + eslint-config-next
- UI utilities y librerias:
	- class-variance-authority
	- clsx + tailwind-merge
	- embla-carousel-react
	- lucide-react
	- react-icons
	- react-markdown
	- @base-ui/react

## Estructura del Proyecto

```text
.
|- app/
|  |- layout.tsx
|  |- page.tsx
|  |- servicios/page.tsx
|  |- error.tsx
|  |- not-found.tsx
|- components/
|  |- globales/
|  |- home/
|  |- servicios/
|  |- ui/
|- Data/
|  |- home/
|  |- servicios/
|- lib/
|- shared/
|- style/
|- public/
|- package.json
|- tsconfig.json
|- eslint.config.mjs
```

## Arquitectura y Convenciones

### 1. Enrutamiento y Layout global

- Se usa App Router de Next.js.
- `app/layout.tsx` define la estructura base de toda la aplicacion.
- Header y Footer se renderizan globalmente para mantener consistencia entre paginas.

### 2. Organizacion por dominio

- `components/home`: secciones exclusivas de la pagina de inicio.
- `components/servicios`: secciones especializadas del catalogo de servicios.
- `components/globales`: bloques compartidos entre varias rutas (Header, Footer, cards, etc.).
- `Data/*`: fuentes de contenido tipadas para renderizado declarativo.

### 3. Componentes guiados por datos

La pagina de servicios no esta hardcodeada por completo en JSX:

- `Data/servicios/servicios-data.tsx` define fases, textos, estilos y cards.
- `components/globales/section-servicios.tsx` recorre y pinta cada bloque.
- `components/globales/service-card.tsx` procesa descripciones en Markdown con `react-markdown`.

Esto facilita mantener y escalar contenido sin duplicar UI.

### 4. Tipado compartido

- `shared/types.ts` contiene contratos reutilizables como `ServiceCard` y `ServiceSectionProps`.
- El uso de tipos reduce errores de estructura al inyectar contenido desde `Data/`.

### 5. Estilos y sistema visual

- `style/globals.css` integra Tailwind, tokens de tema y variables CSS.
- Se utilizan utilidades de mezcla de clases en `lib/utils.ts` (`cn`) para composicion limpia.

## Paginas y Secciones Actuales

## `/` (Home)

Compuesta por:

1. Hero principal.
2. Transformacion digital (3 pilares).
3. Proceso de trabajo.
4. Bloque "Lo que hacemos mejor".
5. CTA final "Ahorra tiempo, dinero y escala".

## `/servicios`

Incluye:

1. Hero de catalogo.
2. Secciones por fases (diseno, desarrollo, cloud) generadas desde data.
3. Bloque de microservicios para emprendimientos.

## Scripts Disponibles

Desde la raiz del proyecto:

```bash
npm run dev
```
Inicia el servidor de desarrollo.

```bash
npm run build
```
Genera el build de produccion.

```bash
npm run start
```
Levanta el build de produccion.

```bash
npm run lint
```
Ejecuta el analisis estatico con ESLint.

## Requisitos Previos

- Node.js 20+ recomendado.
- npm (o gestor compatible).

## Instalacion y Ejecucion Local

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar modo desarrollo:

```bash
npm run dev
```

3. Abrir en navegador:

```text
http://localhost:3000
```

## Alias y Resolucion de Imports

El proyecto usa alias de TypeScript:

- `@/*` -> raiz del proyecto.

Ejemplo:

```ts
import Header from "@/components/globales/Header";
```

## Estado Actual y Pendientes Tecnicos

Actualmente hay algunos puntos identificados para completar:

- `app/error.tsx` esta definido pero sin interfaz final.
- `app/not-found.tsx` esta definido pero sin interfaz final.
- `lib/useFetch.tsx` existe como placeholder y aun no implementa logica.
- El Header incluye enlaces (portafolio, nosotros, precios, contacto) que todavia no tienen rutas en `app/`.

## Buenas Practicas para Continuar

- Mantener componentes presentacionales en `components/` y contenido en `Data/`.
- Crear nuevas rutas en `app/` antes de enlazarlas en navegacion.
- Tipar nuevos bloques desde `shared/types.ts` para conservar consistencia.
- Ejecutar `npm run lint` antes de abrir PRs o merges.

## Despliegue

El proyecto puede desplegarse en plataformas compatibles con Next.js, por ejemplo Vercel.

Flujo sugerido:

1. `npm run build`
2. Validar el build localmente con `npm run start`
3. Publicar en el proveedor elegido

---

Si quieres, tambien puedo prepararte una segunda version del README orientada a clientes (menos tecnica) y otra orientada a onboarding de desarrolladores (mas tecnica y con checklist de arranque).
