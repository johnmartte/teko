import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Estamos construyéndolo | TEKO",
  robots: { index: false },
};

export default function EnConstruccionPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#080a0f", color: "#f2f3f5" }}
    >
      <h1 className="text-3xl font-bold sm:text-5xl">
        Estamos{" "}
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "#1ec4ff" }}>
          construyéndolo
        </span>
      </h1>
      <p className="mt-4 max-w-md text-base" style={{ color: "rgba(242,243,245,0.55)" }}>
        Esta plataforma estará disponible muy pronto. Vuelve a visitarnos o escríbenos si quieres saber más.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/plataformas" className="rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:brightness-110" style={{ background: "#1ec4ff", color: "#080a0f" }}>
          Ver plataformas
        </Link>
        <Link href="/contacto" className="rounded-xl border px-6 py-3 text-sm font-semibold transition-colors" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(242,243,245,0.7)" }}>
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
