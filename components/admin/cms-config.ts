export type Field = { key: string; label: string; type?: "text" | "textarea" | "number" | "checkbox" | "select" | "password"; required?: boolean; options?: Array<{ value: string; label: string }>; relation?: { endpoint: string; labelKey: string; emptyLabel?: string } };
export type ModuleConfig = { key: string; label: string; singular: string; endpoint: string; fields: Field[]; titleKey: string };

const common = { sort_order: { key: "sort_order", label: "Orden", type: "number" as const }, is_active: { key: "is_active", label: "Activo", type: "checkbox" as const } };
export const modules: ModuleConfig[] = [
  { key: "services", label: "Servicios", singular: "servicio", endpoint: "/admin/services", titleKey: "title", fields: [
    { key: "title", label: "Título", required: true }, { key: "slug", label: "Slug", required: true }, { key: "description", label: "Descripción", type: "textarea" },
    { key: "type", label: "Tipo", type: "select", options: [{ value: "service", label: "Servicio" }, { value: "microservice", label: "Microservicio" }] },
    { key: "category_id", label: "Categoría", type: "select", relation: { endpoint: "/admin/service-categories", labelKey: "name", emptyLabel: "Sin categoría" } }, { key: "icon_key", label: "Clave de icono" }, { key: "badge", label: "Badge" },
    { key: "starting_price", label: "Precio inicial", type: "number" }, { key: "price_suffix", label: "Sufijo de precio" }, { key: "currency", label: "Moneda" }, common.sort_order, common.is_active,
  ]},
  { key: "service-categories", label: "Categorías de servicios", singular: "categoría", endpoint: "/admin/service-categories", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true }, { key: "slug", label: "Slug", required: true }, { key: "display_type", label: "Presentación" }, common.sort_order, common.is_active,
  ]},
  { key: "faqs", label: "FAQs", singular: "FAQ", endpoint: "/admin/faqs", titleKey: "question", fields: [
    { key: "question", label: "Pregunta", required: true }, { key: "answer", label: "Respuesta", type: "textarea", required: true }, common.sort_order, common.is_active,
  ]},
  { key: "plans", label: "Planes", singular: "plan", endpoint: "/admin/plans", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true }, { key: "slug", label: "Slug", required: true }, { key: "tagline", label: "Descripción", type: "textarea" },
    { key: "currency", label: "Moneda" }, { key: "monthly_price", label: "Precio mensual", type: "number" }, { key: "project_price", label: "Precio proyecto", type: "number" },
    { key: "project_price_label", label: "Etiqueta de precio" }, { key: "features", label: "Features (una por línea)", type: "textarea" },
    { key: "is_highlighted", label: "Destacado", type: "checkbox" }, common.sort_order, common.is_active,
  ]},
  { key: "budget-ranges", label: "Rangos de presupuesto", singular: "rango", endpoint: "/admin/budget-ranges", titleKey: "label", fields: [
    { key: "label", label: "Etiqueta", required: true }, { key: "min_amount", label: "Mínimo", type: "number" }, { key: "max_amount", label: "Máximo", type: "number" }, { key: "currency", label: "Moneda" }, common.sort_order, common.is_active,
  ]},
  { key: "portfolio-projects", label: "Portfolio", singular: "proyecto", endpoint: "/admin/portfolio-projects", titleKey: "title", fields: [
    { key: "category_id", label: "Categoría", type: "select", required: true, relation: { endpoint: "/admin/portfolio-categories", labelKey: "name" } }, { key: "title", label: "Título", required: true }, { key: "slug", label: "Slug", required: true },
    { key: "short_description", label: "Descripción", type: "textarea", required: true }, { key: "image_url", label: "URL imagen" }, { key: "image_light_url", label: "URL imagen light" }, { key: "image_dark_url", label: "URL imagen dark" },
    { key: "project_url", label: "URL proyecto" }, { key: "github_url", label: "GitHub" }, { key: "client_name", label: "Cliente" }, { key: "year", label: "Año", type: "number" }, { key: "metric", label: "Métrica" },
    { key: "is_featured", label: "Destacado", type: "checkbox" }, common.sort_order, common.is_active,
  ]},
  { key: "portfolio-categories", label: "Categorías de portfolio", singular: "categoría", endpoint: "/admin/portfolio-categories", titleKey: "name", fields: [
    { key: "name", label: "Nombre", required: true }, { key: "slug", label: "Slug", required: true }, common.sort_order, common.is_active,
  ]},
];
