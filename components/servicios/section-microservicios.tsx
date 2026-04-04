import Image from "next/image";
import Background from "@/public/Background-seccion.svg";
import { microservicios } from "@/Data/servicios/microservicios-data";

export default function SectionMicroservicios() {
    return (
        <section className="relative flex justify-center px-4 md:px-8 py-16 md:py-24 overflow-hidden">
            <Image
                className="absolute inset-0 w-full h-full object-cover -z-10"
                src={Background}
                alt=""
                aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-6xl rounded-3xl md:rounded-[2.5rem] bg-linear-to-br from-[#eaf4ff] to-white/60 p-6 sm:p-8 md:p-14 shadow-sm backdrop-blur-md">
                {/* Encabezado */}
                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-cyan-100 px-3 py-4 min-w-14">

                        <span className="text-2xl font-extrabold leading-none text-cyan-600">
                            04
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            FASE
                        </span>
                        <h2 className="text-3xl text-cyan-600 font-extrabold tracking-tight  md:text-4xl lg:text-5xl">
                            Microservicios para Emprendimientos
                        </h2>
                    </div>
                </div>

                {/* Descripción */}
                <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-600">
                    Soluciones puntuales a precio cerrado para negocios que necesitan presencia digital rápida sin
                    complejidad técnica. Cada microservicio es un entregable independiente, listo para usar.
                </p>

                {/* Grid de items */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {microservicios.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={i}
                                className="flex items-start gap-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
                                    <Icon className="h-5 w-5 text-cyan-600 stroke-[1.5]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
