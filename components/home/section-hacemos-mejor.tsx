import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { data_hacemos_mejor_cards } from "@/Data/home/hacemos-mejor-cards";
import { Card, CardHeader, CardContent } from "../ui/card";

export default function SectionHacemosMejor() {
  return (
    <section className="py-24 px-6 md:px-12 flex flex-col gap-5">
      <div className="flex flex-col items-start w-full">
        <h2 className="mb-4 text-5xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
          Lo que hacemos mejor
        </h2>
        <p className="text-lg font-light text-gray-600 leading-relaxed max-w-2xl ">
          Un ecosistema completo de servicios digitales para llevar tu negocio
          al siguiente nivel. La transformación digital de tu negocio empieza en
          TEKO.
        </p>
      </div>
      <div className="flex justify-end">
        <Button variant={"outline"} className={"p-5 rounded-full"}>
          Ver todos los servicios <ArrowRight />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-3">
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
