
"use client";

import { useEffect, useRef, useState } from "react";
import { SIZES, BULK_MIN_QUANTITY, priceForItem, cartQuantity, repriceCart } from "../../lib/pricing";

const COLORS = [
  { name: "Schwarz", hex: "#202222", file: "black" },
  { name: "Olivegrün", hex: "#596347", file: "olive" },
  { name: "Sand / Khaki", hex: "#c7b28e", file: "khaki" },
  { name: "Grau", hex: "#777c7d", file: "grey" },
];



const DESIGNS = Array.from({ length: 22 }, (_, i) => ({
  id: `design-${i + 1}`,
  name: `Motiv ${i + 1}`,
  image: `/Designs/${i + 1}.png`,
}));

// Vorläufige Druckmaße
const PRINT_AREAS = {
  front: { width: 30, height: 35 },
  back: { width: 30, height: 40 },
};

// Unsere gemeinsam ausgerichteten Druckflächen
const PRINT_RECT = {
  front: { left: 33, top: 12, width: 34, height: 65 },
  back: { left: 30, top: 12, width: 34, height: 65 },
};

const DESIGN_KEY = "barracks-tshirt-design-v1";
const CART_KEY = "barracks-cart-v1";

function euro(value) {
  return Number(value).toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function constrainMotif(motif) {
  const ratio = motif.ratio || 1;
  const height = motif.width / ratio;
  const radians = (motif.rotation * Math.PI) / 180;

  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const halfWidth =
    (motif.width * cos + height * sin) / 2;

  const halfHeight =
    (motif.width * sin + height * cos) / 2;

  return {
    ...motif,
    x: clamp(
      motif.x,
      Math.min(halfWidth, 50),
      Math.max(100 - halfWidth, 50)
    ),
    y: clamp(
      motif.y,
      Math.min(halfHeight, 50),
      Math.max(100 - halfHeight, 50)
    ),
  };
}

function ShirtEditor({
  color,
  side,
  motifs,
  selectedId,
  onSelect,
  onMove,
}) {
  const printRef = useRef(null);
  const dragRef = useRef(null);

  const rect = PRINT_RECT[side];
  const area = PRINT_AREAS[side];

  const shirtImage =
    `/shirts/shirt-${color.file}-${side}.png`;

  const startDrag = (event, motif) => {
    if (event.button !== 0) return;
    if (!printRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const bounds =
      printRef.current.getBoundingClientRect();

   dragRef.current = {
  mode: "move",
  id: motif.id,
  startX: event.clientX,
  startY: event.clientY,
  x: motif.x,
  y: motif.y,
  bounds,
};

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    onSelect(motif.id);
  };

 
const moveDrag = (event) => {
  const drag = dragRef.current;
  if (!drag) return;

  if (drag.mode === "resize") {
    const deltaX =
      ((event.clientX - drag.startX) /
        drag.bounds.width) * 100;

    const deltaY =
      ((event.clientY - drag.startY) /
        drag.bounds.height) * 100;

    const change =
      Math.abs(deltaX) > Math.abs(deltaY)
        ? deltaX
        : deltaY;

    onMove(drag.id, {
      width: clamp(drag.width + change, 8, 95),
    });

    return;
  }

  const deltaX =
    ((event.clientX - drag.startX) /
      drag.bounds.width) * 100;

  const deltaY =
    ((event.clientY - drag.startY) /
      drag.bounds.height) * 100;

  onMove(drag.id, {
    x: drag.x + deltaX,
    y: drag.y + deltaY,
  });
};
  
const startResize = (event, motif) => {
  event.preventDefault();
  event.stopPropagation();

  if (!printRef.current) return;

  const bounds = printRef.current.getBoundingClientRect();

  dragRef.current = {
    mode: "resize",
    id: motif.id,
    startX: event.clientX,
    startY: event.clientY,
    width: motif.width,
    bounds,
  };

  event.currentTarget.setPointerCapture(event.pointerId);
  onSelect(motif.id);
};

const stopDrag = () => {
  dragRef.current = null;
};

  return (
    <div className="relative mx-auto w-full max-w-[550px] overflow-hidden rounded-lg bg-white">
      <img
        src={shirtImage}
        alt={`${color.name} T-Shirt ${side}`}
        draggable={false}
        className="block h-auto w-full select-none"
      />

      <div
        ref={printRef}
        className="absolute border-2 border-dashed border-[#a4aa8c]/80"
        style={{
          left: `${rect.left}%`,
          top: `${rect.top}%`,
          width: `${rect.width}%`,
          height: `${rect.height}%`,
        }}
      >
        {motifs.map((motif) => {
          const design = DESIGNS.find(
            (item) => item.id === motif.designId
          );

          if (!design) return null;

          const selected = motif.id === selectedId;

          return (
            <div
              key={motif.id}
              onPointerDown={(event) =>
                startDrag(event, motif)
              }
              onPointerMove={moveDrag}
              onPointerUp={stopDrag}
              onPointerCancel={stopDrag}
              onLostPointerCapture={stopDrag}
              onClick={() => onSelect(motif.id)}
              className={`absolute cursor-grab select-none touch-none active:cursor-grabbing ${
                selected
                  ? "outline outline-2 outline-dashed outline-[#a4aa8c]"
                  : ""
              }`}
              style={{
                left: `${motif.x}%`,
                top: `${motif.y}%`,
                width: `${motif.width}%`,
                transform: `translate(-50%, -50%) rotate(${motif.rotation}deg)`,
                transformOrigin: "center",
              }}
            >
            
<img
  src={design.image}
  alt={design.name}
  draggable={false}
  className="pointer-events-none block h-auto w-full"
/>

{selected && (
  <div
    onPointerDown={(event) => startResize(event, motif)}
    onPointerMove={moveDrag}
    onPointerUp={stopDrag}
    onPointerCancel={stopDrag}
    onLostPointerCapture={stopDrag}
    className="absolute -bottom-3 -right-3 z-20 flex h-7 w-7 cursor-nwse-resize touch-none items-center justify-center rounded-md border-2 border-white bg-[#596347] text-white shadow-lg"
    title="Ziehen, um das Motiv zu vergrößern"
  >
    ↘
  </div>
)}

            </div>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-3 rounded bg-black/70 px-3 py-2 text-xs font-bold text-white">
        Druckfläche: {area.width} × {area.height} cm
      </div>
    </div>
  );
}

export default function TshirtPage() {
  const [color, setColor] = useState(COLORS[0]);

  const [sizes, setSizes] = useState({
    S: 0,
    M: 0,
    L: 1,
    XL: 0,
    XXL: 0,
  });

  const [side, setSide] = useState("front");

  const [motifs, setMotifs] = useState({
    front: [],
    back: [],
  });

  const [selectedId, setSelectedId] = useState(null);
  const [existingCart, setExistingCart] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cart = [];
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (Array.isArray(stored)) cart = stored;
    } catch (error) { console.error("Warenkorb lesen:", error); }
    setExistingCart(cart);
    const id = new URLSearchParams(window.location.search).get("edit");
    const item = id ? cart.find((entry) => entry.id === id && entry.type === "custom-tshirt") : null;
    if (id && !item) {
      alert("Dieses T-Shirt ist nicht mehr im Warenkorb.");
      window.location.replace("/warenkorb");
      return;
    }
    if (item) {
      setEditingId(item.id);
      setColor(COLORS.find((entry) => entry.file === item.color?.file) || COLORS[0]);
      setSizes(Object.fromEntries(SIZES.map((size) => [size, Math.max(0, Number(item.sizes?.[size]) || 0)])));
      setMotifs({ front: item.motifs?.front || [], back: item.motifs?.back || [] });
      setSide("front");
      setSelectedId(null);
    }
    setReady(true);
  }, []);

  const quantity = SIZES.reduce(
    (sum, size) => sum + sizes[size],
    0
  );

  const frontCount = motifs.front.length;
  const backCount = motifs.back.length;
  const totalMotifs = frontCount + backCount;

  const otherShirts = cartQuantity(existingCart.filter((item) => item.id !== editingId));
  const combinedQuantity = otherShirts + quantity;
  const calculated = priceForItem({ sizes, motifs }, combinedQuantity);
  const shirtPrice = calculated.basePrice;
  const motifUnitPrice = calculated.motifUnitPrice;
  const motifsPrice = calculated.motifsPrice;
  const pricePerShirt = calculated.pricePerShirt;
  const totalPrice = calculated.totalPrice;

  const currentMotifs = motifs[side];

  const selectedMotif = currentMotifs.find(
    (motif) => motif.id === selectedId
  );

  const changeSizeQuantity = (size, amount) => {
    setSizes((previous) => ({
      ...previous,
      [size]: clamp(
        previous[size] + amount,
        0,
        999
      ),
    }));
  };

  const changeSide = (newSide) => {
    setSide(newSide);
    setSelectedId(null);
  };

  const addMotif = (designId) => {
    const motif = constrainMotif({
      id: crypto.randomUUID(),
      designId,
      x: 50,
      y: 50,
      width: 35,
      ratio: 1,
      rotation: 0,
    });

    setMotifs((previous) => ({
      ...previous,
      [side]: [...previous[side], motif],
    }));

    setSelectedId(motif.id);
  };

  const updateMotif = (id, changes) => {
    setMotifs((previous) => ({
      ...previous,
      [side]: previous[side].map((motif) => {
        if (motif.id !== id) return motif;

        return constrainMotif({
          ...motif,
          ...changes,
        });
      }),
    }));
  };

  const removeMotif = () => {
    if (!selectedId) return;

    setMotifs((previous) => ({
      ...previous,
      [side]: previous[side].filter(
        (motif) => motif.id !== selectedId
      ),
    }));

    setSelectedId(null);
  };

  const clearSide = () => {
    setMotifs((previous) => ({
      ...previous,
      [side]: [],
    }));

    setSelectedId(null);
  };

  const resetPosition = () => {
    if (!selectedMotif) return;

    updateMotif(selectedMotif.id, {
      x: 50,
      y: 50,
      width: 35,
      rotation: 0,
    });
  };

  // DESIGN SPEICHERN
  const saveDesign = () => {
    try {
      const designData = {
        version: 1,
        color: color.file,
        sizes,
        motifs,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        DESIGN_KEY,
        JSON.stringify(designData)
      );

      alert("Dein T-Shirt-Design wurde gespeichert!");
    } catch (error) {
      console.error(error);
      alert("Das Design konnte nicht gespeichert werden.");
    }
  };

  // DESIGN LADEN
  const loadDesign = () => {
    try {
      const saved = localStorage.getItem(DESIGN_KEY);

      if (!saved) {
        alert("Du hast noch kein Design gespeichert.");
        return;
      }

      const data = JSON.parse(saved);

      if (
        data.version !== 1 ||
        !data.sizes ||
        !data.motifs ||
        !Array.isArray(data.motifs.front) ||
        !Array.isArray(data.motifs.back)
      ) {
        alert("Die gespeicherten Daten sind ungültig.");
        return;
      }

      const savedColor = COLORS.find(
        (item) => item.file === data.color
      );

      if (!savedColor) {
        alert("Die gespeicherte Farbe ist nicht verfügbar.");
        return;
      }

      const restoredSizes = Object.fromEntries(
        SIZES.map((size) => [
          size,
          clamp(
            Number(data.sizes[size]) || 0,
            0,
            999
          ),
        ])
      );

      setColor(savedColor);
      setSizes(restoredSizes);
      setMotifs(data.motifs);
      setSide("front");
      setSelectedId(null);

      alert("Dein Design wurde erfolgreich geladen!");
    } catch (error) {
      console.error(error);
      alert("Das Design konnte nicht geladen werden.");
    }
  };

  // IN DEN WARENKORB / BESTEHENDE POSITION AKTUALISIEREN
  const addToCart = () => {
    if (quantity < 1) {
      alert("Bitte mindestens ein T-Shirt auswählen.");
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const cart = Array.isArray(stored) ? stored : [];
      const previous = editingId ? cart.find((item) => item.id === editingId) : null;
      if (editingId && !previous) {
        alert("Die ursprüngliche Position wurde entfernt. Bitte erneut öffnen.");
        return;
      }
      const cartItem = {
        id: previous?.id || crypto.randomUUID(),
        type: "custom-tshirt",
        color: { name: color.name, file: color.file },
        sizes: { ...sizes },
        quantity,
        motifs: JSON.parse(JSON.stringify(motifs)),
        pricePerShirt,
        totalPrice,
        createdAt: previous?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextCart = editingId
        ? cart.map((item) => item.id === editingId ? cartItem : item)
        : [...cart, cartItem];
      localStorage.setItem(CART_KEY, JSON.stringify(repriceCart(nextCart)));
      window.location.href = "/warenkorb";
    } catch (error) {
      console.error(error);
      alert("Das T-Shirt konnte nicht gespeichert werden.");
    }
  };

  const buttonClass = (active) =>
    `rounded-md border px-4 py-3 font-bold transition ${
      active
        ? "border-[#a4aa8c] bg-[#596347]"
        : "border-[#454a39] bg-[#1d211a] hover:border-[#929879]"
    }`;

  if (!ready) return <main className="min-h-screen bg-[#10120e] p-8 text-white">Konfigurator wird geladen...</main>;

  return (
    <main className="min-h-screen bg-[#10120e] text-[#e8dfca]">

      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#444a39] px-5 py-5 md:px-12">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/barracks-logo.png"
            alt="Barracks Supply Co."
            className="h-14 w-14 object-contain"
          />
          <span className="font-black tracking-wider">
            BARRACKS
            <span className="block text-sm text-[#929879]">
              SUPPLY CO.
            </span>
          </span>
        </a>

        <div className="flex items-center gap-5">
          <a
            href="/warenkorb"
            className="text-sm font-bold text-[#a4aa8c]"
          >
            🛒 WARENKORB
          </a>
          <a
            href="/"
            className="text-sm font-bold text-[#a9aa9f]"
          >
            STARTSEITE
          </a>
        </div>
      </header>

      {/* TITEL */}
      <section className="px-5 py-12 text-center">
        <p className="text-sm font-bold tracking-[0.3em] text-[#a4aa8c]">
          CUSTOM MILITARY APPAREL
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          {editingId ? "DEIN SHIRT BEARBEITEN." : "BUILD YOUR SHIRT."}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[#a9aa9f]">
          Wähle deine Motive und gestalte dein individuelles T-Shirt.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-2 lg:px-10">

        {/* LINKE SEITE: SHIRT-VORSCHAU */}
        <div>
          <div className="rounded-xl border border-[#454a39] bg-[#1b2019] p-5">
            <div className="mb-5 flex justify-between gap-3 text-xs font-bold tracking-widest">
              <span className="text-[#a4aa8c]">
                LIVE-SHIRT-DESIGNER
              </span>
              <span className="text-[#a9aa9f]">
                {side === "front"
                  ? "VORDERSEITE"
                  : "RÜCKSEITE"}
              </span>
            </div>

            <ShirtEditor
              color={color}
              side={side}
              motifs={currentMotifs}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onMove={updateMotif}
            />

            <p className="mt-4 text-center text-xs text-[#a9aa9f]">
              Die gestrichelte Linie zeigt die bedruckbare Fläche.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => changeSide("front")}
                className={buttonClass(side === "front")}
              >
                VORDERSEITE ({frontCount})
              </button>

              <button
                type="button"
                onClick={() => changeSide("back")}
                className={buttonClass(side === "back")}
              >
                RÜCKSEITE ({backCount})
              </button>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-[#8c9284]">
            Die Druckflächen sind vorläufige Produktionsvorgaben.
            Die tatsächlichen Maße müssen mit den Shirts
            abgeglichen werden.
          </p>
        </div>

        {/* RECHTE SEITE: KONFIGURATOR */}
        <div className="space-y-8">

          {/* FARBE */}
          <div>
            <h2 className="mb-4 text-xl font-black">
              01 / FARBE WÄHLEN
            </h2>

            <div className="flex flex-wrap gap-4">
              {COLORS.map((item) => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`flex flex-col items-center gap-2 rounded-lg p-2 ${
                    color.file === item.file
                      ? "bg-[#292f23]"
                      : ""
                  }`}
                >
                  <span
                    className={`h-12 w-12 rounded-full border-2 ${
                      color.file === item.file
                        ? "border-white"
                        : "border-[#596047]"
                    }`}
                    style={{
                      backgroundColor: item.hex,
                    }}
                  />
                  <span className="text-xs">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* GRÖSSENVERTEILUNG */}
          <div className="rounded-xl border border-[#596347] bg-[#1d211a] p-5">
            <h2 className="mb-3 text-xl font-black">
              02 / GRÖSSEN & MENGEN
            </h2>

            <p className="mb-5 text-sm text-[#a9aa9f]">
              Wähle die Anzahl pro Größe. Alle Shirts
              erhalten dieselbe Farbe und dasselbe Design.
            </p>

            <div className="space-y-3">
              {SIZES.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg border border-[#454a39] bg-[#10120e] p-3"
                >
                  <span className="text-lg font-black">
                    {item}
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        changeSizeQuantity(item, -1)
                      }
                      disabled={sizes[item] === 0}
                      className="rounded-md border border-[#596347] px-4 py-2 font-black disabled:opacity-30"
                    >
                      −
                    </button>

                    <span className="w-8 text-center text-lg font-bold">
                      {sizes[item]}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changeSizeQuantity(item, 1)
                      }
                      disabled={sizes[item] >= 999}
                      className="rounded-md border border-[#596347] px-4 py-2 font-black disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#454a39] pt-4">
              <span className="font-bold">
                T-SHIRTS GESAMT
              </span>
              <span className="text-2xl font-black">
                {quantity}
              </span>
            </div>

            {combinedQuantity >= BULK_MIN_QUANTITY ? (
              <p className="mt-3 font-bold text-[#a4aa8c]">
                Mengenrabatt aktiviert! 14,99 € Grundpreis pro Shirt (inklusive anderer Warenkorb-Shirts).
              </p>
            ) : (
              <p className="mt-3 text-sm text-[#a9aa9f]">
                Noch {Math.max(0, BULK_MIN_QUANTITY - combinedQuantity)} Shirt(s)
                bis zum Mengenrabatt.
              </p>
            )}
          </div>

          {/* MOTIVGALERIE */}
          
{/* MOTIVGALERIE */}
<details className="group overflow-hidden rounded-xl border border-[#596347] bg-[#1d211a]">
  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-black [&::-webkit-details-marker]:hidden">
    <div>
      <h2 className="text-xl">
        03 / MOTIVE AUSWÄHLEN
      </h2>
      <p className="mt-2 text-sm font-normal text-[#a9aa9f]">
        22 Designs verfügbar – zum Öffnen klicken
      </p>
    </div>

    <span className="text-2xl text-[#a4aa8c] transition-transform group-open:rotate-180">
      ⌄
    </span>
  </summary>

  <div className="border-t border-[#454a39] p-5">
    <p className="mb-4 text-sm text-[#a9aa9f]">
      Du bearbeitest die{" "}
      <strong className="text-[#e8dfca]">
        {side === "front" ? "Vorderseite" : "Rückseite"}
      </strong>.
      Wähle ein Motiv aus, um es hinzuzufügen.
    </p>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {DESIGNS.map((design) => (
        <button
          key={design.id}
          type="button"
          onClick={() => addMotif(design.id)}
          className="group/item overflow-hidden rounded-lg border border-[#454a39] bg-[#10120e] text-center transition hover:border-[#a4aa8c]"
        >
          <div className="flex aspect-square items-center justify-center bg-[#353a31] p-3">
            <img
              src={design.image}
              alt={design.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition group-hover/item:scale-105"
            />
          </div>

          <div className="p-3">
            <span className="block text-sm font-bold">
              {design.name}
            </span>
            <span className="mt-1 block text-xs text-[#a4aa8c]">
              + HINZUFÜGEN
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
</details>

          {/* MOTIVE BEARBEITEN */}
          <div className="rounded-xl border border-[#596347] bg-[#1d211a] p-5">
            <h2 className="mb-4 text-xl font-black">
              04 / MOTIV BEARBEITEN
            </h2>

            {currentMotifs.length > 0 ? (
              <div className="mb-5 space-y-2">
                <p className="text-sm text-[#a9aa9f]">
                  Motive auf dieser Seite:
                </p>

                {currentMotifs.map((motif, index) => {
                  const design = DESIGNS.find(
                    (item) => item.id === motif.designId
                  );

                  return (
                    <button
                      key={motif.id}
                      type="button"
                      onClick={() => setSelectedId(motif.id)}
                      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm ${
                        selectedId === motif.id
                          ? "border-[#a4aa8c] bg-[#303a2a]"
                          : "border-[#454a39]"
                      }`}
                    >
                      <img
                        src={design?.image}
                        alt=""
                        className="h-12 w-12 rounded bg-[#454a39] object-contain p-1"
                      />
                      <span className="font-bold">
                        {index + 1}. {design?.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mb-5 text-sm text-[#a9aa9f]">
                Auf dieser Seite sind noch keine Motive platziert.
              </p>
            )}

            {selectedMotif ? (
              <div className="space-y-6">

                <div>
                  <label className="mb-2 flex justify-between text-sm">
                    <span>Links / Rechts</span>
                    <span>
                      {Math.round(selectedMotif.x)}%
                    </span>
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedMotif.x}
                    onChange={(event) =>
                      updateMotif(selectedMotif.id, {
                        x: Number(event.target.value),
                      })
                    }
                    className="w-full accent-[#a4aa8c]"
                  />
                </div>

                <div>
                  <label className="mb-2 flex justify-between text-sm">
                    <span>Oben / Unten</span>
                    <span>
                      {Math.round(selectedMotif.y)}%
                    </span>
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedMotif.y}
                    onChange={(event) =>
                      updateMotif(selectedMotif.id, {
                        y: Number(event.target.value),
                      })
                    }
                    className="w-full accent-[#a4aa8c]"
                  />
                </div>

                <div>
                  <label className="mb-2 flex justify-between text-sm">
                    <span>Motivbreite</span>
                    <span>
                      {(
                        (selectedMotif.width / 100) *
                        PRINT_AREAS[side].width
                      ).toFixed(1)} cm
                    </span>
                  </label>

                  <input
                    type="range"
                    min="8"
                    max="95"
                    value={selectedMotif.width}
                    onChange={(event) =>
                      updateMotif(selectedMotif.id, {
                        width: Number(event.target.value),
                      })
                    }
                    className="w-full accent-[#a4aa8c]"
                  />
                </div>

                <div>
                  <label className="mb-2 flex justify-between text-sm">
                    <span>Drehung</span>
                    <span>
                      {selectedMotif.rotation}°
                    </span>
                  </label>

                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={selectedMotif.rotation}
                    onChange={(event) =>
                      updateMotif(selectedMotif.id, {
                        rotation: Number(event.target.value),
                      })
                    }
                    className="w-full accent-[#a4aa8c]"
                  />
                </div>

                <button
                  type="button"
                  onClick={resetPosition}
                  className="w-full rounded-md border border-[#596347] px-4 py-3 font-bold hover:bg-[#303a2a]"
                >
                  POSITION ZURÜCKSETZEN
                </button>

                <button
                  type="button"
                  onClick={removeMotif}
                  className="w-full rounded-md border border-red-700 px-4 py-3 font-bold text-red-300 hover:bg-red-950"
                >
                  AUSGEWÄHLTES MOTIV ENTFERNEN
                </button>
              </div>
            ) : (
              <p className="text-sm text-[#a9aa9f]">
                Wähle ein Motiv aus, um es zu bearbeiten.
              </p>
            )}

            {currentMotifs.length > 0 && (
              <button
                type="button"
                onClick={clearSide}
                className="mt-5 w-full rounded-md border border-[#454a39] px-4 py-3 text-sm font-bold text-[#a9aa9f] hover:bg-[#303a2a]"
              >
                ALLE MOTIVE DIESER SEITE ENTFERNEN
              </button>
            )}
          </div>

          {/* PREISBERECHNUNG */}
          <div className="rounded-xl border border-[#596347] bg-[#1d211a] p-6">
            <h2 className="mb-5 text-xl font-black">
              DEINE BESTELLUNG
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Farbe</span>
                <strong>{color.name}</strong>
              </div>

              <div className="flex justify-between gap-4">
                <span>Größenverteilung</span>
                <strong className="text-right">
                  {SIZES.filter((item) => sizes[item] > 0)
                    .map((item) => `${item}: ${sizes[item]}`)
                    .join(" · ") || "Keine Shirts"}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Anzahl Shirts</span>
                <strong>{quantity}</strong>
              </div>

              <div className="flex justify-between">
                <span>Motive vorne</span>
                <strong>{frontCount}</strong>
              </div>

              <div className="flex justify-between">
                <span>Motive hinten</span>
                <strong>{backCount}</strong>
              </div>
            </div>

            <div className="my-5 border-t border-[#454a39]" />

            <div className="space-y-3 text-sm text-[#a9aa9f]">
              <div className="flex justify-between">
                <span>Grundpreis pro Shirt</span>
                <span>{euro(shirtPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>
                  {totalMotifs} Motive × {euro(motifUnitPrice)}
                </span>
                <span>{euro(motifsPrice)}</span>
              </div>

              <div className="flex justify-between">
                <span>Preis pro Shirt</span>
                <strong className="text-[#e8dfca]">
                  {euro(pricePerShirt)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Anzahl</span>
                <span>× {quantity}</span>
              </div>
            </div>

            <div className="my-5 border-t border-[#454a39]" />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                GESAMTPREIS
              </span>
              <span className="text-3xl font-black">
                {euro(totalPrice)}
              </span>
            </div>

            {combinedQuantity >= BULK_MIN_QUANTITY && (
              <p className="mt-3 text-sm font-bold text-[#a4aa8c]">
                Mengenrabatt aktiviert: 14,99 € Grundpreis pro Shirt!
              </p>
            )}

            {totalMotifs >= 2 && (
              <p className="mt-2 text-sm font-bold text-[#a4aa8c]">
                Motivrabatt aktiviert: nur 4 € pro Motiv!
              </p>
            )}

            {/* SPEICHERN / LADEN */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={saveDesign}
                className="rounded-lg border border-[#a4aa8c] bg-[#596347] px-4 py-4 text-sm font-black text-white transition hover:bg-[#71805a]"
              >
                💾 DESIGN SPEICHERN
              </button>

              <button
                type="button"
                onClick={loadDesign}
                className="rounded-lg border border-[#596347] bg-[#1d211a] px-4 py-4 text-sm font-black text-white transition hover:bg-[#30392a]"
              >
                📂 DESIGN LADEN
              </button>
            </div>

            {/* WARENKORB */}
            <button
              type="button"
              onClick={addToCart}
              disabled={quantity === 0}
              className="mt-4 w-full rounded-lg bg-[#596347] px-6 py-4 text-lg font-black text-white transition hover:bg-[#71805a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {editingId ? "✓ ÄNDERUNGEN IM WARENKORB SPEICHERN" : "🛒 IN DEN WARENKORB"}
            </button>

            <p className="mt-3 text-center text-xs text-[#a9aa9f]">
              Testversion. Noch keine Bestellung oder Bezahlung möglich.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#454a39] p-8 text-center text-sm text-[#929879]">
        © 2026 Barracks Supply Co. · Austria
      </footer>
    </main>
  );
}