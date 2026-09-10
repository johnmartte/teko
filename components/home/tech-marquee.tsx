"use client";

const techs = ["React", "Next.js", "Node", "PostgreSQL", "AWS", "Vercel", "Cloudflare", "DigitalOcean", "Figma", "Stripe", "WhatsApp API", "Flutter"];

export default function TechMarquee() {
  return (
    <section aria-label="Stack tecnológico" className="mx-auto max-w-[1200px] px-6" style={{ marginTop: "64px" }}>
      <div className="overflow-hidden border-y py-[22px]" style={{
        borderColor: "rgba(255,255,255,0.08)",
        maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}>
        <div className="flex w-max animate-[tk-marquee_34s_linear_infinite] gap-14 whitespace-nowrap text-[15px] font-medium tracking-[-0.01em]" style={{ color: "rgba(242,243,245,0.5)" }}>
          {techs.map((t) => <span key={t}>{t}</span>)}
          {techs.map((t) => <span key={`${t}-2`}>{t}</span>)}
        </div>
      </div>
    </section>
  );
}
