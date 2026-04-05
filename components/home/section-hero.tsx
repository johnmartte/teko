import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function SectionHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(177.332deg,#0071ff_10.397%,#ffffff_96.272%)] px-4 pt-[200px] pb-16 sm:px-6 md:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:62px_62px]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <div className="relative top-[-22px] w-full max-w-[1120px] md:top-[-26px] lg:h-[301.347px] lg:w-[1120px]">
          <h1
            className={cn(
              "font-advercase text-center text-[34px] font-bold leading-[42px] tracking-[-0.012em] text-white sm:text-[52px] sm:leading-[60px] md:text-[64px] md:leading-[74px] lg:text-[72px] lg:leading-[74px]",
            )}
          >
            Construimos productos
            <br />
            digitales que{" "}
            <span
              className={cn(
                "font-ppeditorialold font-normal italic text-[#0047ff] lg:text-[72px] lg:leading-[74px]",
              )}
            >
              transforman
            </span>{" "}
            tu
            <br />
            negocio en el{" "}
            <span
              className={cn(
                "font-ppeditorialold font-normal italic text-[#2e5fff] lg:text-[72px] lg:leading-[74px]",
              )}
            >
              futuro
            </span>
            .
          </h1>
        </div>

        <div className="mt-1 flex w-full flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0">
          <Button className="h-11 w-full rounded-full bg-[rgba(0,71,255,0.5)] px-7 text-[13px] font-black text-white shadow-none transition-colors hover:bg-[rgba(0,71,255,0.6)] sm:w-[140px]">
            Agenda una cita
          </Button>

          <Button
            variant="outline"
            className="h-11 w-full rounded-full border-0 bg-transparent px-7 text-[13px] font-medium text-[#0047ff] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] backdrop-blur-[2px] transition-colors hover:bg-white/10 hover:text-[#0047ff] sm:w-[140px]"
          >
            Ver planes
          </Button>
        </div>
      </div>
    </section>
  );
}
