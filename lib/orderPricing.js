
import {
  SIZES,
  cartQuantity,
  priceForItem,
} from "./pricing";

const ALLOWED_COLORS = [
  "black",
  "olive",
  "khaki",
  "grey",
];

const ALLOWED_DESIGN_IDS = new Set(
  Array.from({ length: 22 }, (_, index) => index + 1)
);


function isValidMotif(motif) {
  if (!motif || typeof motif !== "object") {
    return false;
  }

  const designId = String(motif.designId || "");
  const match = /^design-(\d+)$/.exec(designId);

  if (
    !match ||
    !ALLOWED_DESIGN_IDS.has(Number(match[1]))
  ) {
    return false;
  }

  const x = Number(motif.x);
  const y = Number(motif.y);
  const width = Number(motif.width);
  const ratio = Number(motif.ratio);
  const rotation = Number(motif.rotation);

  if (
    ![x, y, width, ratio, rotation].every(Number.isFinite) ||
    width <= 0 ||
    width > 100 ||
    ratio <= 0 ||
    ratio > 100 ||
    Math.abs(rotation) > 360
  ) {
    return false;
  }

  const height = width / ratio;
  const radians = (rotation * Math.PI) / 180;

  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const halfWidth =
    (width * cos + height * sin) / 2;

  const halfHeight =
    (width * sin + height * cos) / 2;

  // Dieselbe geometrische Begrenzung
  // wie im T-Shirt-Konfigurator.
  const minX = Math.min(halfWidth, 50);
  const maxX = Math.max(100 - halfWidth, 50);

  const minY = Math.min(halfHeight, 50);
  const maxY = Math.max(100 - halfHeight, 50);

  const tolerance = 0.001;

  return (
    x >= minX - tolerance &&
    x <= maxX + tolerance &&
    y >= minY - tolerance &&
    y <= maxY + tolerance
  );


  return (
    ALLOWED_DESIGN_IDS.has(designId) &&
    Number.isFinite(Number(motif.x)) &&
    Number.isFinite(Number(motif.y)) &&
    Number.isFinite(Number(motif.width)) &&
    Number(motif.width) > 0 &&
    Number.isFinite(Number(motif.rotation)) &&
    Number.isFinite(Number(motif.ratio)) &&
    Number(motif.ratio) > 0
  );
}

export function calculateOrder(cart, country) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Der Warenkorb ist leer.");
  }

  if (!["AT", "DE"].includes(country)) {
    throw new Error(
      "Bestellungen sind derzeit nur für Österreich und Deutschland möglich."
    );
  }

  if (
    cart.length > 50 ||
    cart.some((item) => item?.type !== "custom-tshirt")
  ) {
    throw new Error("Ungültiger Warenkorb.");
  }

  const totalShirts = cartQuantity(cart);

  if (totalShirts < 1 || totalShirts > 1000) {
    throw new Error("Ungültige Bestellmenge.");
  }

  const items = cart.map((item) => {
    const color = item?.color?.file;

    if (!ALLOWED_COLORS.includes(color)) {
      throw new Error("Ungültige T-Shirt-Farbe.");
    }

    const sizes = {};

    for (const size of SIZES) {
      const raw = item?.sizes?.[size] ?? 0;
      const amount = Number(raw);

      if (
        !Number.isSafeInteger(amount) ||
        amount < 0 ||
        amount > 1000
      ) {
        throw new Error("Ungültige T-Shirt-Größe oder Menge.");
      }

      sizes[size] = amount;
    }

    const front = item?.motifs?.front;
    const back = item?.motifs?.back;

    if (!Array.isArray(front) || !Array.isArray(back)) {
      throw new Error("Ungültige Druckmotive.");
    }

    if (
      front.length + back.length > 30 ||
      !front.every(isValidMotif) ||
      !back.every(isValidMotif)
    ) {
      throw new Error("Ungültige Druckmotive.");
    }

    const cleanItem = {
      type: "custom-tshirt",
      color: {
        file: color,
        name: {
          black: "Schwarz",
          olive: "Olivegrün",
          khaki: "Sand/Khaki",
          grey: "Grau",
        }[color],
      },
      sizes,
      motifs: {
        front: front.map((motif) => ({
      designId: `design-${Number(
  String(motif.designId).replace(/^design-/, "")
)}`,
          x: Number(motif.x),
          y: Number(motif.y),
          width: Number(motif.width),
          ratio: Number(motif.ratio),
          rotation: Number(motif.rotation),
        })),
        back: back.map((motif) => ({
        designId: `design-${Number(
  String(motif.designId).replace(/^design-/, "")
)}`,
          x: Number(motif.x),
          y: Number(motif.y),
          width: Number(motif.width),
          ratio: Number(motif.ratio),
          rotation: Number(motif.rotation),
        })),
      },
    };

    const price = priceForItem(cleanItem, totalShirts);

    if (price.quantity === 0) {
      throw new Error("Ein Artikel hat keine Menge.");
    }

    return {
      ...cleanItem,
      quantity: price.quantity,
      unit_price: price.pricePerShirt,
      line_total: price.totalPrice,
    };
  });

  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.line_total * 100),
    0
  );

  const shippingCents = country === "AT" ? 0 : 699;

  return {
    items,
    quantity: totalShirts,
    subtotal: subtotalCents / 100,
    shipping_cost: shippingCents / 100,
    total: (subtotalCents + shippingCents) / 100,
    currency: "EUR",
    shipping_country: country,
  };
}
