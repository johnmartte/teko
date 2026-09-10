type LegalSection = {
  title: string;
  content: string[];
};

type LegalContentProps = {
  lastUpdated: string;
  sections: LegalSection[];
};

export default function LegalContent({
  lastUpdated,
  sections,
}: LegalContentProps) {
  return (
    <section className="mx-auto w-full max-w-[820px] px-6 py-14 md:px-[80px] md:py-20" style={{ color: "#f2f3f5" }}>
      <p className="mb-10 text-[13px]" style={{ color: "rgba(242,243,245,0.4)" }}>
        Última actualización: {lastUpdated}
      </p>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="mb-4 text-[20px] font-bold">
              {i + 1}. {s.title}
            </h2>
            {s.content.map((p, j) => (
              <p
                key={j}
                className="mb-3 text-[15px] leading-[26px]"
                style={{ color: "rgba(242,243,245,0.6)" }}
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
