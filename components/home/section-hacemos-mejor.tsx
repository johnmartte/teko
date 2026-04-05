import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { data_hacemos_mejor_cards } from "@/Data/home/hacemos-mejor-cards";
import { Card, CardHeader, CardContent } from "../ui/card";

export default function SectionHacemosMejor() {
  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pb-14 pt-12 md:px-[80px] md:pb-20 md:pt-[50px]">
      
      {/* Encabezado y Botón adaptables */}
      <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="flex max-w-[700px] flex-col items-start">
          <h2 className="mb-3 text-[34px] font-extrabold tracking-[-0.06em] text-[#101828] md:text-[40px] md:leading-[48px]">
            Lo que hacemos mejor
          </h2>
          <p className="text-[14px] font-normal leading-[24px] text-[#99a1af]">
            Un ecosistema completo de servicios digitales para llevar tu negocio
            al siguiente nivel. La transformación digital de tu negocio empieza en
            TEKO.
          </p>
        </div>
        
        {/* En móvil ocupa todo el ancho, en desktop se ajusta a su contenido */}
        <Button
          variant={"outline"}
          className="h-[48px] w-full rounded-full border-[#d5d7da] px-6 text-[14px] font-semibold text-[#252b37] sm:w-auto"
        >
          Ver todos los servicios <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {data_hacemos_mejor_cards.map((card, index) => (
          <Card
            key={index}
            className="flex h-full min-h-[390px] flex-col justify-between rounded-[24px] border-none bg-[#f4f7ff] p-0 shadow-none"
          >
            <CardHeader className="flex min-h-[220px] items-center justify-center p-6 pb-4">
              {card.image}
            </CardHeader>
            <CardContent className="px-6 pb-6 text-left">
              <h3 className="mb-2 text-[20px] font-semibold leading-[26px] text-[#101828]">
                {card.titulo}
              </h3>
              <p className="text-[14px] leading-[22px] text-[#7a8595]">
                {card.descripcion}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </section>
  );
}