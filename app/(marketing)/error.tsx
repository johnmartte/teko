"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "#080a0f", color: "#f2f3f5" }}
    >
      <p
        className="text-[10rem] font-bold leading-none tracking-tighter sm:text-[14rem]"
        style={{
          background: "linear-gradient(180deg, rgba(248,113,113,0.9) 0%, rgba(248,113,113,0.2) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        500
      </p>

      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
        Algo salio{" "}
        <span
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            color: "#f87171",
          }}
        >
          mal
        </span>
      </h1>

      <p
        className="mt-4 max-w-md text-base"
        style={{ color: "rgba(242,243,245,0.55)" }}
      >
        Ocurrio un error inesperado. Intenta de nuevo o contactanos si el
        problema persiste.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1ec4ff", color: "#080a0f" }}
        >
          Intentar de nuevo
        </button>
        <a
          href="/"
          className="rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "rgba(242,243,245,0.7)",
          }}
        >
          Volver al inicio
        </a>
      </div>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #f87171 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
