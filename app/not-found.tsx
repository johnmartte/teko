import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#080a0f", color: "#f2f3f5" }}
    >
      <p
        className="text-[10rem] font-bold leading-none tracking-tighter sm:text-[14rem]"
        style={{
          background: "linear-gradient(180deg, rgba(30,196,255,0.9) 0%, rgba(30,196,255,0.2) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </p>

      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
        Pagina no{" "}
        <span
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            color: "#1ec4ff",
          }}
        >
          encontrada
        </span>
      </h1>

      <p
        className="mt-4 max-w-md text-base"
        style={{ color: "rgba(242,243,245,0.55)" }}
      >
        La pagina que buscas no existe o fue movida. Verifica la URL o regresa
        al inicio.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1ec4ff", color: "#080a0f" }}
        >
          Volver al inicio
        </Link>
        <Link
          href="/contacto"
          className="rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "rgba(242,243,245,0.7)",
          }}
        >
          Contactanos
        </Link>
      </div>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #1ec4ff 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
