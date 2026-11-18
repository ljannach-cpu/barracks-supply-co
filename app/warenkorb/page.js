"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SIZES, cartQuantity, euro, repriceCart } from "../../lib/pricing";

const CART_KEY = "barracks-cart-v1";
const PRINT_RECT = {
  front: { left: 33, top: 12, width: 34, height: 65 },
  back: { left: 30, top: 12, width: 34, height: 65 },
};

function ShirtPreview({ item, side }) {
  const color = item.color?.file || "black";
  const rect = PRINT_RECT[side];
  const motifs = Array.isArray(item.motifs?.[side]) ? item.motifs[side] : [];
  return (
    <div className="min-w-0">
      <p className="mb-2 text-center text-xs font-black tracking-widest text-[#596347]">
        {side === "front" ? "VORDERSEITE" : "RÜCKSEITE"}
      </p>
      <div className="relative w-full overflow-hidden rounded-lg bg-white">
        <img src={`/shirts/shirt-${color}-${side}.png`} alt={`T-Shirt ${side === "front" ? "vorne" : "hinten"}`} className="block h-auto w-full" draggable={false} />
        <div className="absolute" style={{ left: `${rect.left}%`, top: `${rect.top}%`, width: `${rect.width}%`, height: `${rect.height}%` }}>
          {motifs.map((motif) => {
            const designNumber = Number(String(motif.designId || "").replace("design-", ""));
            if (!Number.isInteger(designNumber) || designNumber < 1 || designNumber > 22) return null;
            return (
              <div key={motif.id} className="absolute" style={{ left: `${motif.x}%`, top: `${motif.y}%`, width: `${motif.width}%`, transform: `translate(-50%, -50%) rotate(${motif.rotation || 0}deg)`, transformOrigin: "center" }}>
                <img src={`/Designs/${designNumber}.png`} alt={`Motiv ${designNumber}`} className="block h-auto w-full" draggable={false} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WarenkorbPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCart(repriceCart(Array.isArray(saved) ? saved : []));
    } catch (error) {
      console.error("Warenkorb konnte nicht geladen werden:", error);
      setCart([]);
    }
    setLoaded(true);
  }, []);

  function updateCart(next) {
    const repriced = repriceCart(next);
    setCart(repriced);
    localStorage.setItem(CART_KEY, JSON.stringify(repriced));
  }
  function removeItem(id) {
    updateCart(cart.filter((item) => item.id !== id));
  }
  function clearCart() {
    if (window.confirm("Warenkorb wirklich leeren?")) updateCart([]);
  }
  function changeSize(id, size, delta) {
    updateCart(cart.map((item) => {
      if (item.id !== id) return item;
      const oldValue = Math.max(0, Math.floor(Number(item.sizes?.[size]) || 0));
      const nextValue = Math.max(0, Math.min(999, oldValue + delta));
      const sizes = { ...item.sizes, [size]: nextValue };
      const total = SIZES.reduce((sum, s) => sum + (Number(sizes[s]) || 0), 0);
      return total === 0 ? item : { ...item, sizes };
    }));
  }

  const shirts = cartQuantity(cart);
  const subtotal = Math.round(cart.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0) * 100) / 100;

  if (!loaded) return <main className="min-h-screen bg-[#10120e] p-8 text-white">Warenkorb wird geladen...</main>;

  return (
    <main className="min-h-screen bg-[#10120e] px-4 py-10 text-[#e8dfca]">
      <div className="mx-auto max-w-6xl">
        <Link href="/t-shirts" className="text-sm font-bold text-[#a4aa8c] hover:underline">← Zurück zum T-Shirt-Konfigurator</Link>
        <h1 className="mt-6 text-4xl font-black">DEIN WARENKORB</h1>
        <p className="mt-2 text-[#a9aa9f]">BARRACKS SUPPLY CO. / DEINE AUSRÜSTUNG</p>

        {cart.length === 0 ? (
          <div className="mt-10 rounded-xl border border-[#596347] bg-[#1d211a] p-8 text-center">
            <h2 className="text-2xl font-black">Dein Warenkorb ist leer.</h2>
            <p className="mt-3 text-[#a9aa9f]">Erstelle dein eigenes T-Shirt-Design.</p>
            <Link href="/t-shirts" className="mt-6 inline-block rounded-lg bg-[#596347] px-6 py-4 font-black text-white hover:bg-[#71805a]">T-SHIRT GESTALTEN</Link>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div className="space-y-5">
              {cart.map((item) => {
                const frontCount = item.motifs?.front?.length || 0;
                const backCount = item.motifs?.back?.length || 0;
                const quantity = SIZES.reduce((sum, size) => sum + (Number(item.sizes?.[size]) || 0), 0);
                return (
                  <article key={item.id} className="min-w-0 rounded-xl border border-[#596347] bg-[#1d211a] p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black">CUSTOM T-SHIRT</h2>
                        <p className="mt-1 text-sm text-[#a9aa9f]">Farbe: {item.color?.name || "Unbekannt"} · {quantity} Stück</p>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-300 hover:bg-red-950">Entfernen</button>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5">
                      <ShirtPreview item={item} side="front" />
                      <ShirtPreview item={item} side="back" />
                    </div>
                    <p className="mt-3 text-center text-xs text-[#a9aa9f]">{frontCount} Motiv(e) vorne · {backCount} Motiv(e) hinten</p>

                    <div className="mt-5 rounded-lg border border-[#454a39] bg-[#10120e] p-4">
                      <h3 className="mb-3 text-sm font-black tracking-wider text-[#a4aa8c]">GRÖSSEN & MENGEN</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {SIZES.map((size) => (
                          <div key={size} className="flex items-center justify-between gap-2 rounded-md bg-[#1d211a] px-3 py-2">
                            <strong>{size}</strong>
                            <div className="flex items-center gap-3">
                              <button type="button" aria-label={`${size} verringern`} onClick={() => changeSize(item.id, size, -1)} disabled={!item.sizes?.[size] || quantity <= 1} className="rounded border border-[#596347] px-3 py-1 font-black disabled:opacity-30">−</button>
                              <span className="w-6 text-center font-bold">{item.sizes?.[size] || 0}</span>
                              <button type="button" aria-label={`${size} erhöhen`} onClick={() => changeSize(item.id, size, 1)} disabled={(item.sizes?.[size] || 0) >= 999} className="rounded border border-[#596347] px-3 py-1 font-black disabled:opacity-30">+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-[#454a39] pt-5">
                      <div>
                        <p className="text-sm text-[#a9aa9f]">{euro(item.pricePerShirt)} pro Shirt</p>
                        <p className="mt-1 text-2xl font-black">{euro(item.totalPrice)}</p>
                      </div>
                      {item.type === "custom-tshirt" && (
                        <Link href={`/t-shirts?edit=${encodeURIComponent(item.id)}`} className="rounded-lg border border-[#a4aa8c] bg-[#30392a] px-4 py-3 text-sm font-black hover:bg-[#596347]">✎ DESIGN BEARBEITEN</Link>
                      )}
                    </div>
                  </article>
                );
              })}
              <Link href="/t-shirts" className="inline-block font-bold text-[#a4aa8c] hover:underline">+ Weiteres T-Shirt gestalten</Link>
            </div>

            <aside className="rounded-xl border border-[#596347] bg-[#1d211a] p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-black">BESTELLÜBERSICHT</h2>
              <div className="mt-5 flex justify-between"><span>Positionen</span><strong>{cart.length}</strong></div>
              <div className="mt-3 flex justify-between"><span>T-Shirts gesamt</span><strong>{shirts}</strong></div>
              {shirts >= 10 ? (
                <p className="mt-4 rounded-lg bg-[#30392a] p-3 text-sm font-bold text-[#c5d3a7]">✓ Mengenrabatt aktiv: 14,99 € Grundpreis je T-Shirt.</p>
              ) : (
                <p className="mt-4 text-sm text-[#a9aa9f]">Noch {10 - shirts} T-Shirt(s) bis zum Mengenrabatt.</p>
              )}
              <div className="mt-5 flex justify-between border-t border-[#454a39] pt-5"><span>Zwischensumme</span><strong>{euro(subtotal)}</strong></div>
              <div className="mt-3 flex justify-between gap-3 text-sm"><span>Versand innerhalb Österreichs</span><strong className="text-[#c5d3a7]">GRATIS</strong></div>
              <p className="mt-2 text-xs text-[#a9aa9f]">Für Lieferungen ins Ausland werden Versandkosten im späteren Checkout berechnet.</p>
              <div className="mt-5 flex justify-between border-t border-[#454a39] pt-5"><span className="font-black">GESAMT (AT)</span><strong className="text-2xl">{euro(subtotal)}</strong></div>
              <p className="mt-2 text-xs text-[#a9aa9f]">Endbetrag für Österreich. Auslandskosten und Zahlungsbedingungen folgen im Checkout.</p>
              <Link href="/checkout" className="mt-6 block rounded-lg bg-[#596347] px-6 py-4 text-center font-black text-white hover:bg-[#71805a]">ZUR KASSE</Link>
              <p className="mt-2 text-center text-xs text-[#a9aa9f]">Checkout noch in Vorbereitung – keine Zahlung möglich.</p>
              <button type="button" onClick={clearCart} className="mt-4 w-full rounded-lg border border-[#596347] px-6 py-3 text-sm font-bold hover:bg-[#30392a]">WARENKORB LEEREN</button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}