
import Link from "next/link";

const EMAIL = "barracks.supply@gmx.at";

// Hier später deinen tatsächlichen Instagram-Link eintragen.
const INSTAGRAM_URL =
  "https://www.instagram.com/barracks.supply.co/";

const products = [
  {
    title: "CUSTOM T-SHIRTS",
    label: "APPAREL",
    description:
      "Military-inspirierte Shirts, starke Motive und individuelle Designs. Wähle deinen Style und zeig, wofür du stehst.",
    icon: "★",
  },
  {
    title: "STICKER COLLECTION",
    label: "STICKERS",
    description:
      "Einzigartige Sticker für Laptops, Trinkflaschen und vieles mehr. Von Military-Motiven bis zu kreativen Memes.",
    icon: "✦",
  },
  {
    title: "DEINE WUNSCHDESIGNS",
    label: "CUSTOM ORDERS",
    description:
      "Du hast eine Idee für deine Einheit, deine Gruppe oder dich selbst? Schreib uns und erzähl uns davon.",
    icon: "✉",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#10120e] text-[#e8dfca]">
      {/* HEADER */}
      <header className="border-b border-[#454a39]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-10">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/barracks-logo.png"
              alt="Barracks Supply Co. Logo"
              className="h-14 w-14 object-contain md:h-20 md:w-20"
            />

            <span className="text-sm font-black tracking-wider md:text-xl">
              BARRACKS
              <span className="block text-[#929879]">
                SUPPLY CO.
              </span>
            </span>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#858d68] px-4 py-3 text-xs font-black tracking-widest text-[#d6ceb9] transition hover:bg-[#858d68] hover:text-black"
          >
            INSTAGRAM
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#454a39] px-5 py-24 text-center md:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#596347]/20 blur-3xl md:h-[550px] md:w-[550px]" />

        <div className="relative mx-auto max-w-5xl">
          <p className="mb-7 text-xs font-bold tracking-[0.35em] text-[#b8a67b] md:text-sm">
            AUSTRIAN MILITARY LIFESTYLE
          </p>

          <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">
            SOMETHING
            <span className="mt-3 block text-[#8c956b]">
              IS COMING.
            </span>
          </h1>

          <div className="mx-auto mt-9 w-fit border border-[#858d68] bg-[#1d211a] px-6 py-3">
            <p className="text-sm font-black tracking-[0.25em] text-[#d6ceb9]">
              ONLINE SHOP – COMING SOON
            </p>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-[#a9aa9f] md:text-xl">
            Military-inspired Apparel, einzigartige Sticker
            und individuelle Designs.
            <br />
            Wir bereiten gerade unseren Onlineshop für dich vor.
          </p>

          <p className="mt-9 text-lg font-black tracking-widest text-[#b8a67b] md:text-2xl">
            DEINE IDEE. UNSERE MISSION.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#preview"
              className="bg-[#858d68] px-8 py-4 text-sm font-black tracking-widest text-black transition hover:bg-[#b2bc91]"
            >
              ERSTE EINBLICKE
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#858d68] px-8 py-4 text-sm font-black tracking-widest transition hover:bg-[#1d211a]"
            >
              FOLLOW THE MISSION
            </a>
          </div>
        </div>
      </section>

      {/* PRODUKTVORSCHAU */}
      <section
        id="preview"
        className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28"
      >
        <div className="mb-12">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-[#b8a67b]">
            FIRST LOOK
          </p>

          <h2 className="text-3xl font-black md:text-5xl">
            DAS ERWARTET DICH.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-[#a9aa9f]">
            Unsere Mission hat gerade erst begonnen.
            Entdecke, was bei Barracks Supply Co.
            auf dich wartet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.title}
              className="group overflow-hidden border border-[#454a39] bg-[#1d211a] transition hover:border-[#929879]"
            >
              <div className="flex h-56 flex-col items-center justify-center border-b border-[#454a39] bg-gradient-to-br from-[#343d2c] via-[#22291f] to-[#10120e]">
                <span className="text-7xl text-[#b8a67b]">
                  {product.icon}
                </span>

                <span className="mt-5 text-xs font-bold tracking-[0.3em] text-[#b8a67b]">
                  {product.label}
                </span>
              </div>

              <div className="p-7">
                <p className="mb-3 text-xs font-bold tracking-widest text-[#929879]">
                  0{index + 1} / 03
                </p>

                <h3 className="text-2xl font-black">
                  {product.title}
                </h3>

                <p className="mt-4 leading-7 text-[#a9aa9f]">
                  {product.description}
                </p>

                <p className="mt-7 text-xs font-black tracking-[0.2em] text-[#b8a67b]">
                  COMING SOON
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SONDERWÜNSCHE */}
      <section
        id="sonderwuensche"
        className="border-y border-[#454a39] bg-[#1d211a] px-5 py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-[#b8a67b]">
            CUSTOM ORDERS
          </p>

          <h2 className="text-4xl font-black md:text-6xl">
            DU HAST EINE IDEE?
            <span className="mt-3 block text-[#8c956b]">
              WIR HABEN DIE MISSION.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#a9aa9f]">
            Ob individuelle T-Shirts, Sticker oder
            Designs für deine Einheit, Gruppe oder
            Veranstaltung – schick uns deine Wünsche!
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(
                "Meine Idee für Barracks Supply Co."
              )}`}
              className="bg-[#858d68] px-8 py-4 text-sm font-black tracking-widest text-black transition hover:bg-[#b2bc91]"
            >
              E-MAIL SCHREIBEN
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#858d68] px-8 py-4 text-sm font-black tracking-widest transition hover:bg-[#292f23]"
            >
              ÜBER INSTAGRAM KONTAKTIEREN
            </a>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="px-5 py-20 text-center md:py-28">
        <p className="mb-4 text-sm font-bold tracking-[0.3em] text-[#b8a67b]">
          FOLLOW THE MISSION
        </p>

        <h2 className="text-3xl font-black md:text-5xl">
          SEI VON ANFANG AN DABEI.
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-7 text-[#a9aa9f]">
          Neue Designs, Einblicke hinter die Kulissen
          und alle Updates zum Shopstart findest du
          auf unserem Instagram-Profil.
        </p>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 inline-block border border-[#858d68] px-8 py-4 font-black tracking-widest text-[#d6ceb9] transition hover:bg-[#858d68] hover:text-black"
        >
          INSTAGRAM ENTDECKEN
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#454a39] bg-[#0b0d0a] px-5 py-9">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div>
            <p className="font-black tracking-widest">
              BARRACKS SUPPLY CO.
            </p>

            <p className="mt-2 text-sm text-[#929879]">
              Austrian Military Lifestyle
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${EMAIL}`}
              className="text-[#d6ceb9] hover:underline"
            >
              {EMAIL}
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#929879] hover:underline"
            >
              Instagram
            </a>
            <a
  href="/impressum"
  className="text-[#929879] hover:underline"
>
  Impressum
</a>
<a
  href="/datenschutz"
  className="text-[#929879] hover:underline"
>
  Datenschutz
</a>
          </div>

          <p className="text-xs text-[#929879]">
          © 2026 Barracks Supply Co.
          </p>
        </div>
      </footer>
    </main>
  );
}
