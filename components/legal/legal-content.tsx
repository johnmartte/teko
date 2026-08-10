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
    <section className="mx-auto w-full max-w-[820px] px-6 py-14 md:px-[80px] md:py-20">
      <p className="mb-10 text-[13px] text-[#7a8595] dark:text-[#a1a8b3]">
        Última actualización: {lastUpdated}
      </p>

      <div className="space-y-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="mb-4 text-[20px] font-bold text-[#101828] dark:text-white">
              {i + 1}. {s.title}
            </h2>
            {s.content.map((p, j) => (
              <p
                key={j}
                className="mb-3 text-[15px] leading-[26px] text-[#252b37] dark:text-[#c5cad3]"
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
