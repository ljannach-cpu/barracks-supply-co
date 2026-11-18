
import { randomUUID } from "node:crypto";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { calculateOrder } from "../../../lib/orderPricing";

function validText(value, min = 1, max = 200) {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.trim().length <= max
  );
}

function validateCustomer(customer) {
  if (!customer || typeof customer !== "object") {
    throw new Error("Kundendaten fehlen.");
  }

  const required = [
    "firstName",
    "lastName",
    "street",
    "postalCode",
    "city",
  ];

  for (const field of required) {
    if (!validText(customer[field])) {
      throw new Error(`Ungültiges Feld: ${field}`);
    }
  }

  if (
    !validText(customer.email, 3, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
  ) {
    throw new Error("Ungültige E-Mail-Adresse.");
  }

  if (!["AT", "DE"].includes(customer.country)) {
    throw new Error("Lieferland nicht verfügbar.");
  }

  if (customer.differentBilling) {
    const billingRequired = [
      "billingFirstName",
      "billingLastName",
      "billingStreet",
      "billingPostalCode",
      "billingCity",
    ];

    for (const field of billingRequired) {
      if (!validText(customer[field])) {
        throw new Error(`Ungültige Rechnungsadresse: ${field}`);
      }
    }

    if (!["AT", "DE", "CH"].includes(customer.billingCountry)) {
      throw new Error("Ungültiges Rechnungsland.");
    }
  }

  if (customer.note && !validText(customer.note, 0, 1000)) {
    throw new Error("Bestellhinweis ist zu lang.");
  }

  return {
    firstName: customer.firstName.trim(),
    lastName: customer.lastName.trim(),
    email: customer.email.trim(),
    phone: String(customer.phone || "").trim(),
    company: String(customer.company || "").trim(),
    vatId: String(customer.vatId || "").trim(),
    street: customer.street.trim(),
    addressExtra: String(customer.addressExtra || "").trim(),
    postalCode: customer.postalCode.trim(),
    city: customer.city.trim(),
    country: customer.country,
    differentBilling: Boolean(customer.differentBilling),
    billingFirstName: String(customer.billingFirstName || "").trim(),
    billingLastName: String(customer.billingLastName || "").trim(),
    billingCompany: String(customer.billingCompany || "").trim(),
    billingStreet: String(customer.billingStreet || "").trim(),
    billingPostalCode: String(customer.billingPostalCode || "").trim(),
    billingCity: String(customer.billingCity || "").trim(),
    billingCountry: customer.billingCountry || "AT",
  };
}

export async function POST(request) {
  // Sicherheitsgrenze: Nur im lokalen Entwicklungsbetrieb.
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.ENABLE_TEST_ORDERS !== "true"
  ) {
    return Response.json(
      { error: "Bestellungen sind noch nicht freigeschaltet." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    if (body.paymentMethod !== "bank") {
      return Response.json(
        { error: "Aktuell ist nur Vorkasse im Testbetrieb möglich." },
        { status: 400 }
      );
    }

    const customer = validateCustomer(body.customer);
    const order = calculateOrder(body.cart, customer.country);

    const orderId = randomUUID();

    const orderNumber =
      `BSC-${Date.now()}-${orderId.slice(0, 8).toUpperCase()}`;

    const orderData = {
      id: orderId,
      order_number: orderNumber,
      customer_data: customer,
      payment_method: "bank",
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      total: order.total,
      shipping_country: order.shipping_country,
      customer_note: body.customer.note || null,
    };

    const orderItems = order.items.map((item) => ({
      product_type: item.type,
      color: item.color,
      sizes: item.sizes,
      motifs: item.motifs,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.line_total,
    }));

    const supabase = getSupabaseAdmin();

    // Ein einziger Datenbankaufruf:
    // Bestellung und Artikel werden atomar gespeichert.
    const { error } = await supabase.rpc("create_shop_order", {
      p_order: orderData,
      p_items: orderItems,
    });

    if (error) {
      console.error("Supabase-Bestellfehler:", error.message);

      throw new Error(
        "Die Bestellung konnte nicht gespeichert werden."
      );
    }

    return Response.json(
      {
        success: true,
        orderNumber,
        total: order.total,
        currency: "EUR",
        paymentStatus: "pending",
        message: "Testbestellung erfolgreich gespeichert.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bestell-API:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bestellung fehlgeschlagen.",
      },
      { status: 400 }
    );
  }
}
