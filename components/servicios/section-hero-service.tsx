import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServicesHero() {
    return (
        <section className="bg-[#f3f4f6] px-6 pb-16 pt-[102px] md:px-[100px] md:pt-[122px]">
            <div className="mx-auto max-w-[1240px]">
                <Link
                    href="/"
                    className="inline-flex items-center text-[14px] font-medium leading-[20px] text-[#101828] transition-colors hover:text-[#2563eb]"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>

                <div className="mt-7 max-w-[976px]">
                    <div className="mb-7 inline-flex h-[30px] items-center rounded-full border border-[rgba(34,211,238,0.2)] bg-[#1ec4ff] px-4 text-[12px] font-semibold text-white">
                        <span className="mr-2 h-[6px] w-[6px] rounded-full bg-[#1082ff]" />
                        Catálogo Completo 2026
                    </div>

                    <h1 className="mb-6 text-[38px] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#101828] md:text-[51.2px] md:leading-[56.32px] md:tracking-[-1.792px]">
                        Todos nuestros <span className="text-[#101828]">servicios</span>
                    </h1>

                    <p className="max-w-[560px] text-[14px] leading-[25.2px] text-[#101828]">
                        Desde identidad de marca hasta infraestructura cloud — un ecosistema
                        completo de soluciones digitales organizadas en 4 fases estratégicas.
                    </p>
                </div>
            </div>
        </section>
    );
}