import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServicesHero() {
    return (
        <section className="bg-[#f3f4f6] dark:bg-[#0a0e1a] px-6 pb-16 pt-[102px] md:px-[100px] md:pt-[122px]">
            <div className="mx-auto max-w-[1240px]">
                <Link
                    href="/"
                    className="inline-flex items-center text-[14px] font-medium leading-[20px] text-[#101828] dark:text-white transition-colors hover:text-[#2563eb]"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>

                <div className="mt-7 max-w-[976px]">
                    <div className="group relative mb-7 inline-flex h-[34px] items-center gap-2.5 overflow-hidden rounded-full border border-white/40 bg-gradient-to-r from-[#1ec4ff] via-[#1082ff] to-[#0047ff] px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_4px_18px_-4px_rgba(16,130,255,0.55)] dark:border-white/10 dark:from-[#1ec4ff]/20 dark:via-[#1082ff]/20 dark:to-[#0047ff]/20 dark:text-white dark:shadow-[0_0_25px_-2px_rgba(30,196,255,0.35)] dark:backdrop-blur-md">
                        <span className="relative flex h-2 w-2 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 dark:bg-[#1ec4ff]" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white dark:bg-[#1ec4ff]" />
                        </span>
                        Catálogo Completo 2026
                    </div>

                    <h1 className="mb-6 text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#101828] dark:text-white md:text-[51.2px] md:leading-[56.32px] md:tracking-[-1.792px]">
                        Todos nuestros <span className="text-[#101828] dark:text-white">servicios</span>
                    </h1>

                    <p className="max-w-[560px] text-[14px] leading-[25.2px] text-[#101828] dark:text-[#a1a8b3]">
                        Desde identidad de marca hasta infraestructura cloud — un ecosistema
                        completo de soluciones digitales organizadas en 4 fases estratégicas.
                    </p>
                </div>
            </div>
        </section>
    );
}