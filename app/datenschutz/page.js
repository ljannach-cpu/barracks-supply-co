
export const metadata = {
  title: "Datenschutz | Barracks Supply Co.",
  description: "Datenschutzerklärung von Barracks Supply Co.",
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-[#10120e] px-6 py-16 text-[#e8dfca]">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm font-bold text-[#929879] hover:text-white"
        >
          ← ZUR STARTSEITE
        </a>

        <h1 className="mt-12 text-4xl font-black md:text-5xl">
          DATENSCHUTZ
        </h1>

        <p className="mt-4 text-[#a9aa9f]">
          Datenschutzerklärung für barracks-supply.at
        </p>

        <div className="mt-10 space-y-10 leading-8">

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              1. Verantwortlicher
            </h2>
            <p className="mt-3">
              Lukas Jannach
              <br />
              Barracks Supply Co.
              <br />
              [GESCHÄFTSANSCHRIFT ERGÄNZEN]
              <br />
              E-Mail: barracks.supply@gmx.at
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              2. Hosting und Server-Logdaten
            </h2>
            <p className="mt-3 text-[#a9aa9f]">
              Beim Aufruf dieser Website werden technisch
              erforderliche Daten verarbeitet. Dazu können
              insbesondere die IP-Adresse, Datum und Uhrzeit
              des Zugriffs, aufgerufene Seiten sowie
              Browserinformationen gehören.
            </p>

            <p className="mt-3 text-[#a9aa9f]">
              Diese Verarbeitung dient der Bereitstellung,
              Sicherheit und Stabilität der Website.
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse).
            </p>

            <p className="mt-3 text-[#a9aa9f]">
              Als Hostinganbieter ist Vercel vorgesehen.
              Weitere Informationen:
              {" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Datenschutzhinweise von Vercel
              </a>
              .
            </p>

            <p className="mt-3 text-amber-300">
              [VOR VERÖFFENTLICHUNG PRÜFEN:
              Hostingstandort, Empfänger, mögliche
              Drittlandübermittlungen und Speicherdauer
              anhand der tatsächlichen Vercel-Konfiguration.]
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              3. Kontaktaufnahme per E-Mail
            </h2>

            <p className="mt-3 text-[#a9aa9f]">
              Wenn du uns per E-Mail kontaktierst,
              verarbeiten wir deine mitgeteilten Daten
              zur Bearbeitung und Beantwortung deiner
              Anfrage.
            </p>

            <p className="mt-3 text-[#a9aa9f]">
              Rechtsgrundlage ist je nach Anfrage
              Art. 6 Abs. 1 lit. b DSGVO
              (vorvertragliche Maßnahmen) oder
              Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an der
              Kommunikation).
            </p>

            <p className="mt-3 text-[#a9aa9f]">
              Die Daten werden nur so lange aufbewahrt,
              wie sie für die Bearbeitung erforderlich
              sind oder gesetzliche Aufbewahrungspflichten
              bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              4. Externe Links
            </h2>

            <p className="mt-3 text-[#a9aa9f]">
              Unsere Website enthält einen Link zu
              Instagram. Erst beim Aufrufen dieses
              Links verlässt du unsere Website.
              Für die anschließende Datenverarbeitung
              gelten die Datenschutzinformationen
              des jeweiligen Anbieters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              5. Deine Rechte
            </h2>

            <p className="mt-3 text-[#a9aa9f]">
              Im Rahmen der gesetzlichen Voraussetzungen
              hast du das Recht auf Auskunft,
              Berichtigung, Löschung, Einschränkung
              der Verarbeitung, Datenübertragbarkeit
              sowie Widerspruch gegen bestimmte
              Verarbeitungen.
            </p>

            <p className="mt-3 text-[#a9aa9f]">
              Du kannst dich außerdem bei der
              österreichischen Datenschutzbehörde
              beschweren:
              {" "}
              <a
                href="https://www.dsb.gv.at/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                www.dsb.gv.at
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#929879]">
              6. Änderungen
            </h2>

            <p className="mt-3 text-[#a9aa9f]">
              Diese Datenschutzerklärung wird angepasst,
              wenn sich Funktionen oder Datenverarbeitungen
              unserer Website ändern.
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
