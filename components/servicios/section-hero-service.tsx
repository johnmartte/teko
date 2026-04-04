import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServicesHero() {
    return (
        <section className="bg-white px-4 md:px-6 pt-24 pb-16 md:pt-32">
            <div className="mx-auto max-w-7xl">

                {/* Enlace Volver */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-slate-800 transition-colors hover:text-blue-600"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>

                {/* Contenido Principal */}
                <div className="mt-10 max-w-3xl">

                    {/* Etiqueta / Badge */}
                    <div className="mb-6 inline-flex items-center rounded-full bg-[#12bbf0] px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
                        {/* Puntito interior */}
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-700"></span>
                        Catálogo Completo 2026
                    </div>

                    {/* Título */}
                    <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] lg:text-6xl lg:leading-tight">
                        Todos nuestros servicios
                    </h1>

                    {/* Descripción */}
                    <p className="max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                        Desde identidad de marca hasta infraestructura cloud — un ecosistema
                        completo de soluciones digitales organizadas en 4 fases estratégicas.
                    </p>

                </div>
            </div>
        </section>
    );
}