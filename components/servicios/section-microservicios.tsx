import Image from "next/image";
import Background from "@/public/Background-seccion.svg";
import { microservicios } from "@/Data/servicios/microservicios-data";

export default function SectionMicroservicios() {
    return (
        <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-24">
            <Image
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-95"
                src={Background}
                alt=""
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(43,127,255,0.14)]" />

            <div className="relative mx-auto max-w-[1058px] rounded-[24px] bg-[#dbebff]/92 p-6 shadow-[0_20px_40px_rgba(28,57,142,0.10)] backdrop-blur-[2px] md:p-[56px]">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(90,128,255,0.1)]">
                        <span className="text-[17.6px] font-black leading-[26.4px] text-[#22d3ee]">
                            04
                        </span>
                    </div>
                    <div>
                        <span className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#22d3ee]">
                            FASE
                        </span>
                        <h2 className="text-[28.8px] font-extrabold leading-[43.2px] tracking-[-0.576px] text-[#1482ff]">
                            Microservicios para Emprendimientos
                        </h2>
                    </div>
                </div>

                <p className="mb-7 max-w-[631px] text-[14px] leading-[25.2px] text-[#111122]">
                    Soluciones puntuales a precio cerrado para negocios que necesitan
                    presencia digital rapida sin complejidad tecnica. Cada microservicio
                    es un entregable independiente, listo para usar.
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {microservicios.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={i}
                                className="rounded-[14px] border border-[rgba(17,17,34,0.06)] bg-[rgba(0,0,0,0.04)] p-[20px]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(90,128,255,0.1)]">
                                        <Icon className="h-4 w-4 text-[#1f4fff]" strokeWidth={1.9} />
                                    </div>
                                    <div>
                                        <p className="text-[14.4px] font-bold leading-[21.6px] text-[#111122]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-[12px] leading-[20.4px] text-[rgba(17,17,34,0.35)]">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
