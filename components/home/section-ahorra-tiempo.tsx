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
    <section className="flex items-center justify-center ">
      <Image className="w-screen object-cover h-120" src={Background} alt="Background" />
      <div className="mx-auto  absolute flex w-full max-w-6xl flex-col items-center justify-between gap-12 rounded-[2.5rem] bg-gradient-to-br from-[#eaf4ff] to-white/60 p-14 shadow-sm backdrop-blur-md lg:flex-row">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#007aff] md:text-5xl">
            Ahorra Tiempo, Dinero <br className="hidden md:block" />y Escala tu
            Negocio.
          </h2>
          <p className="text-lg leading-relaxed text-slate-600">
            TEKO se integra con las plataformas que ya usas, facilitando
            unificar todo en un solo lugar para potenciar tu operación digital.
          </p>

          {/* Input y Botón */}
          <div className="flex w-full max-w-md flex-col items-center gap-3 pt-2 sm:flex-row lg:max-w-none">
            <Input
              type="email"
              placeholder="Tu email de trabajo"
              className="h-14 rounded-full border-none bg-slate-50/80 px-6 text-base shadow-inner focus-visible:ring-1 focus-visible:ring-[#007aff]"
            />
            <Button className="h-14 rounded-full bg-slate-950 px-8 text-white font-medium hover:bg-slate-800 flex items-center gap-3">
              Empezar <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Columna Derecha: Cuadrícula de Iconos */}
        <div className="grid grid-cols-3 gap-5">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="flex h-18 w-18 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1"
            >
              <Icon className="h-7 w-7 text-slate-600 stroke-[1.5]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
