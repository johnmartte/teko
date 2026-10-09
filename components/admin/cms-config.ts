export type Field = { key: string; label: string; placeholder?: string; type?: "text" | "textarea" | "number" | "checkbox" | "select" | "password"; required?: boolean; options?: Array<{ value: string; label: string }>; relation?: { endpoint: string; labelKey: string; emptyLabel?: string } };
export type ModuleConfig = { key: string; label: string; singular: string; endpoint: string; fields: Field[]; titleKey: string };

const common = { sort_order: { key: "sort_order", label: "Orden", type: "number" as const, placeholder: "Ej: 1, 2, 3..." }, is_active: { key: "is_active", label: "Activo", type: "checkbox" as const } };
export const modules: ModuleConfig[] = [
  { key: "services", label: "Servicios", singular: "servicio", endpoint: "/admin/services", titleKey: "title", fields: [
    { key: "title", label: "Titulo", required: true, placeholder: "Ej: Desarrollo Web" }, { key: "slug", label: "Slug", required: true, placeholder: "desarrollo-web" }, { key: "description", label: "Descripcion", type: "textarea", placeholder: "Describe el servicio en detalle..." },
    { key: "type", label: "Tipo", type: "select", options: [{ value: "service", label: "Servicio" }, { value: "microservice", label: "Microservicio" }] },
    { key: "category_id", label: "Categoria", type: "select", relation: { endpoint: "/admin/service-categories", labelKey: "name", emptyLabel: "Sin categoria" } }, { key: "icon_key", label: "Clave de icono", placeholder: "Ej: code, palette, smartphone" }, { key: "badge", label: "Badge", placeholder: "Ej: Popular, Nuevo" },
    { key: "starting_price", label: "Precio inicial", type: "number", placeholder: "0.00" }, { key: "price_suffix", label: "Sufijo de precio", placeholder: "Ej: /mes, /proyecto" }, { key: "currency", label: "Moneda", placeholder: "USD" }, common.sort_order, common.is_active,
  ]},
  { key: "service-categories", label: "Categorias de servicios", singular: "categoria", endpoint: "/admin/service-categories", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true, placeholder: "Ej: Desarrollo" }, { key: "slug", label: "Slug", required: true, placeholder: "desarrollo" }, { key: "display_type", label: "Presentacion", placeholder: "Ej: grid, list" }, common.sort_order, common.is_active,
  ]},
  { key: "faqs", label: "FAQs", singular: "FAQ", endpoint: "/admin/faqs", titleKey: "question", fields: [
    { key: "question", label: "Pregunta", required: true, placeholder: "Ej: Cuanto tiempo toma un proyecto?" }, { key: "answer", label: "Respuesta", type: "textarea", required: true, placeholder: "Escribe la respuesta completa..." }, common.sort_order, common.is_active,
  ]},
  { key: "plans", label: "Planes", singular: "plan", endpoint: "/admin/plans", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true, placeholder: "Ej: Starter, Pro, Enterprise" }, { key: "slug", label: "Slug", required: true, placeholder: "starter" }, { key: "tagline", label: "Descripcion", type: "textarea", placeholder: "Describe las ventajas del plan..." },
    { key: "currency", label: "Moneda", placeholder: "USD" }, { key: "monthly_price", label: "Precio mensual", type: "number", placeholder: "0.00" }, { key: "project_price", label: "Precio proyecto", type: "number", placeholder: "0.00" },
    { key: "project_price_label", label: "Etiqueta de precio", placeholder: "Ej: Desde" }, { key: "features", label: "Features (una por linea)", type: "textarea", placeholder: "Sitio web responsive\nSoporte 24/7\nDominio incluido" },
    { key: "is_highlighted", label: "Destacado", type: "checkbox" }, common.sort_order, common.is_active,
  ]},
  { key: "budget-ranges", label: "Rangos de presupuesto", singular: "rango", endpoint: "/admin/budget-ranges", titleKey: "label", fields: [
    { key: "label", label: "Etiqueta", required: true, placeholder: "Ej: $1,000 - $5,000" }, { key: "min_amount", label: "Minimo", type: "number", placeholder: "1000" }, { key: "max_amount", label: "Maximo", type: "number", placeholder: "5000" }, { key: "currency", label: "Moneda", placeholder: "USD" }, common.sort_order, common.is_active,
  ]},
  { key: "portfolio-projects", label: "Portfolio", singular: "proyecto", endpoint: "/admin/portfolio-projects", titleKey: "title", fields: [
    { key: "category_id", label: "Categoria", type: "select", required: true, relation: { endpoint: "/admin/portfolio-categories", labelKey: "name" } }, { key: "title", label: "Titulo", required: true, placeholder: "Ej: App de Delivery" }, { key: "slug", label: "Slug", required: true, placeholder: "app-delivery" },
    { key: "short_description", label: "Descripcion", type: "textarea", required: true, placeholder: "Breve descripcion del proyecto..." }, { key: "image_url", label: "URL imagen", placeholder: "/portafolio/proyecto.png" }, { key: "image_light_url", label: "URL imagen light", placeholder: "/portafolio/proyecto-light.png" }, { key: "image_dark_url", label: "URL imagen dark", placeholder: "/portafolio/proyecto-dark.png" },
    { key: "project_url", label: "URL proyecto", placeholder: "https://ejemplo.com" }, { key: "github_url", label: "GitHub", placeholder: "https://github.com/..." }, { key: "client_name", label: "Cliente", placeholder: "Nombre del cliente" }, { key: "year", label: "Ano", type: "number", placeholder: "2026" }, { key: "metric", label: "Metrica", placeholder: "Ej: +200% conversion" },
    { key: "is_featured", label: "Destacado", type: "checkbox" }, common.sort_order, common.is_active,
  ]},
  { key: "portfolio-categories", label: "Categorias de portfolio", singular: "categoria", endpoint: "/admin/portfolio-categories", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true, placeholder: "Ej: Apps Moviles" }, { key: "slug", label: "Slug", required: true, placeholder: "apps-moviles" }, common.sort_order, common.is_active,
  ]},
];
