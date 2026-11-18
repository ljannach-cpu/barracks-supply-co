
export const metadata = {
  title: "Impressum | Barracks Supply Co.",
  description: "Impressum von Barracks Supply Co.",
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[#10120e] px-6 py-16 text-[#e8dfca]">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm font-bold text-[#929879] hover:text-white"
        >
          ← ZUR STARTSEITE
        </a>

        <h1 className="mt-12 text-4xl font-black tracking-wide md:text-5xl">
          IMPRESSUM
        </h1>

        <p className="mt-4 text-[#a9aa9f]">
          Angaben zum Betreiber dieser Website
        </p>

        <div className="mt-10 space-y-10 leading-8">
          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              Unternehmensangaben
            </h2>
            <p className="mt-3">
              Lukas Jannach
              <br />
              Einzelunternehmen
              <br />
              Geschäftsbezeichnung: Barracks Supply Co.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              Geschäftsanschrift
            </h2>
            <p className="mt-3 text-amber-300">
              [VOR VERÖFFENTLICHUNG ERGÄNZEN:
              Straße, Hausnummer, PLZ und Ort]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              Kontakt
            </h2>
            <a
              href="mailto:barracks.supply@gmx.at"
              className="mt-3 inline-block hover:underline"
            >
              barracks.supply@gmx.at
            </a>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              Weitere Unternehmensangaben
            </h2>
            <p className="mt-3 text-amber-300">
              [GEWERBEBERECHTIGUNG, ZUSTÄNDIGE
              BEHÖRDE, KAMMERZUGEHÖRIGKEIT UND
              GEGEBENENFALLS FIRMENBUCHANGABEN
              NOCH PRÜFEN UND ERGÄNZEN]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              Medieninhaber und Blattlinie
            </h2>
            <p className="mt-3">
              Medieninhaber: Lukas Jannach
              <br />
              Grundlegende Richtung: Informationen
              über Barracks Supply Co., unsere
              Produkte und individuellen Designs.
            </p>
          </section>
        </div>

        <div className="mt-14 border-t border-[#454a39] pt-6 text-sm text-[#929879]">
          © 2026 Barracks Supply Co.
        </div>
      </div>
    </main>
  );
}
