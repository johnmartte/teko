import { Button } from "@base-ui/react";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  ArrowRight,
  MessageSquare,
  Code,
  Database,
  Cloud,
  LayoutGrid,
  Share2,
} from "lucide-react";
import Background from "@/public/Background-seccion.svg";

export default function SectionAhorraTiempo() {
  const icons = [MessageSquare, Code, Database, Cloud, LayoutGrid, Share2];
  return (
    <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden px-4 py-16 md:px-8 md:py-24">
      <Image
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        src={Background}
        alt="Background"
      />
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-between gap-10 rounded-3xl bg-gradient-to-br from-[#eaf4ff] to-white/60 p-6 shadow-sm backdrop-blur-md sm:p-8 md:gap-12 md:rounded-[2.5rem] md:p-14 lg:flex-row">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#007aff] sm:text-4xl md:text-5xl">
            Ahorra Tiempo, Dinero <br className="hidden md:block" />y Escala tu
            Negocio.
          </h2>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            TEKO se integra con las plataformas que ya usas, facilitando
            unificar todo en un solo lugar para potenciar tu operación digital.
          </p>

          {/* Input y Botón */}
          <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
            <Input
              type="email"
              placeholder="Tu email de trabajo"
              className="h-14 w-full flex-1 rounded-full border-none bg-slate-50/80 px-6 text-base shadow-inner focus-visible:ring-1 focus-visible:ring-[#007aff] sm:w-auto"
            />
            <Button className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-slate-950 px-8 font-medium text-white hover:bg-slate-800 sm:w-auto">
              Empezar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Columna Derecha: Cuadrícula de Iconos */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1 md:h-18 md:w-18"
            >
              <Icon className="h-6 w-6 stroke-[1.5] text-slate-600 md:h-7 md:w-7" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
