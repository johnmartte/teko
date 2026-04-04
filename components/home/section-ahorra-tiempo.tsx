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
    <section className="relative flex items-center justify-center px-4 md:px-8 py-16 md:py-24 min-h-[500px] overflow-hidden">
      <Image className="absolute inset-0 w-full h-full object-cover -z-10" src={Background} alt="Background" />
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#eaf4ff] to-white/60 p-6 sm:p-8 md:p-14 shadow-sm backdrop-blur-md">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#007aff] sm:text-4xl md:text-5xl">
            Ahorra Tiempo, Dinero <br className="hidden md:block" />y Escala tu
            Negocio.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600">
            TEKO se integra con las plataformas que ya usas, facilitando
            unificar todo en un solo lugar para potenciar tu operación digital.
          </p>

          {/* Input y Botón */}
          <div className="flex w-full flex-col items-center gap-3 pt-2 sm:flex-row justify-center lg:justify-start">
            <Input
              type="email"
              placeholder="Tu email de trabajo"
              className="h-14 w-full sm:w-auto flex-1 rounded-full border-none bg-slate-50/80 px-6 text-base shadow-inner focus-visible:ring-1 focus-visible:ring-[#007aff]"
            />
            <Button className="h-14 w-full sm:w-auto rounded-full bg-slate-950 px-8 text-white font-medium hover:bg-slate-800 flex items-center justify-center gap-3">
              Empezar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Columna Derecha: Cuadrícula de Iconos */}
        <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 sm:gap-5">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="flex h-16 w-16 md:h-18 md:w-18 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1"
            >
              <Icon className="h-6 w-6 md:h-7 md:w-7 text-slate-600 stroke-[1.5]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
