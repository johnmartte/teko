import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { data_hacemos_mejor_cards } from "@/Data/home/hacemos-mejor-cards";
import { Card, CardHeader, CardContent } from "../ui/card";

export default function SectionHacemosMejor() {
  return (
    <section className="flex flex-col gap-10 py-16 px-6 md:py-24 md:px-12">
      
      {/* Encabezado y Botón adaptables */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end w-full">
        <div className="flex flex-col items-start max-w-2xl">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
            Lo que hacemos mejor
          </h2>
          <p className="text-base font-light leading-relaxed text-gray-600 md:text-lg">
            Un ecosistema completo de servicios digitales para llevar tu negocio
            al siguiente nivel. La transformación digital de tu negocio empieza en
            TEKO.
          </p>
        </div>
        
        {/* En móvil ocupa todo el ancho, en desktop se ajusta a su contenido */}
        <Button variant={"outline"} className="w-full rounded-full p-5 sm:w-auto">
          Ver todos los servicios <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data_hacemos_mejor_cards.map((card, index) => (
          <Card
            key={index}
            className="flex h-full flex-col justify-between rounded-3xl border-none bg-[#e4efff] p-8 shadow-none"
          >
            <CardHeader className="flex items-center justify-center p-0 pb-10">
              {card.image}
            </CardHeader>
            <CardContent className="p-0 text-left">
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {card.titulo}
              </h3>
              <p className="text-base leading-relaxed text-slate-700">
                {card.descripcion}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </section>
  );
}