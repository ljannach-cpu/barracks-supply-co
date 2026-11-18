
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  cartQuantity,
  priceForItem,
  euro,
} from "../../lib/pricing";

const CART_KEY = "barracks-cart-v1";

const TEST_MODE =
  process.env.NEXT_PUBLIC_ENABLE_CHECKOUT_TEST === "true";

const COUNTRIES = [
  { code: "AT", name: "Österreich" },
  { code: "DE", name: "Deutschland" },
  { code: "CH", name: "Schweiz" },
];

const initialCustomer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  vatId: "",
  street: "",
  postalCode: "",
  city: "",
  country: "AT",
  addressExtra: "",
  differentBilling: false,
  billingFirstName: "",
  billingLastName: "",
  billingCompany: "",
  billingStreet: "",
  billingPostalCode: "",
  billingCity: "",
  billingCountry: "AT",
  note: "",
  acceptTerms: false,
};

const fieldClass =
  "w-full rounded-lg border border-[#596347] bg-[#10120e] px-4 py-3 text-[#e8dfca] outline-none focus:border-[#b8a67b]";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#d6ceb9]";

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder = "",
  autoComplete,
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required && (
          <span className="text-[#d8aa7e]"> *</span>
        )}
      </span>

      <input
        className={fieldClass}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="rounded-xl border border-[#596347] bg-[#1d211a] p-5 sm:p-7">
      <h2 className="mb-6 text-xl font-black tracking-wide">
        <span className="mr-3 text-[#b8a67b]">
          {number}.
        </span>
        {title}
      </h2>

      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [customer, setCustomer] = useState(initialCustomer);
  const [payment, setPayment] = useState("bank");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      setCart(Array.isArray(saved) ? saved : []);
    } catch {
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const totalQuantity = useMemo(
    () => cartQuantity(cart),
    [cart]
  );

  const subtotal = useMemo(() => {
    const cents = cart.reduce((sum, item) => {
      if (item?.type !== "custom-tshirt") {
        return sum;
      }

      const price = priceForItem(item, totalQuantity);

      return sum + Math.round(price.totalPrice * 100);
    }, 0);

    return cents / 100;
  }, [cart, totalQuantity]);

  const shipping =
    customer.country === "AT"
      ? 0
      : customer.country === "DE"
        ? 6.99
        : null;

  const grandTotal =
    shipping === null
      ? null
      : Math.round((subtotal + shipping) * 100) / 100;

  const countryName =
    COUNTRIES.find(
      (country) => country.code === customer.country
    )?.name || customer.country;

  const canTestOrder =
    TEST_MODE &&
    payment === "bank" &&
    customer.country !== "CH" &&
    customer.acceptTerms &&
    !submitting &&
    !success &&
    totalQuantity > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!TEST_MODE) {
      setError(
        "Die Bestellfunktion ist noch nicht freigeschaltet."
      );
      return;
    }

    if (payment !== "bank") {
      setError(
        "Im Testmodus ist nur Vorkasse verfügbar."
      );
      return;
    }

    if (customer.country === "CH") {
      setError(
        "Bestellungen in die Schweiz sind noch nicht möglich."
      );
      return;
    }

    if (!customer.acceptTerms) {
      setError(
        "Bitte bestätige die Kenntnisnahme der Informationen."
      );
      return;
    }

    if (submitting || success) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: payment,
          customer,
          cart,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Die Testbestellung konnte nicht gespeichert werden."
        );
      }

      setSuccess({
        orderNumber: result.orderNumber,
        total: result.total,
        paymentStatus: result.paymentStatus,
      });

      // Warenkorb bewusst NICHT löschen.
      // Wir befinden uns noch im Testbetrieb.
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#10120e] p-8 text-[#e8dfca]">
        Checkout wird geladen ...
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#10120e] px-4 py-16 text-[#e8dfca]">
        <div className="mx-auto max-w-2xl rounded-xl border border-[#596347] bg-[#1d211a] p-8 text-center">
          <p className="text-sm font-bold tracking-widest text-[#b8a67b]">
            BARRACKS SUPPLY CO.
          </p>

          <h1 className="mt-5 text-3xl font-black">
            TESTBESTELLUNG ERFOLGREICH!
          </h1>

          <p className="mt-5 text-[#a9aa9f]">
            Deine Testbestellung wurde in Supabase gespeichert.
          </p>

          <div className="mt-8 rounded-lg border border-[#596347] bg-[#10120e] p-6">
            <p className="text-sm text-[#a9aa9f]">
              BESTELLNUMMER
            </p>

            <p className="mt-2 break-all text-xl font-black text-[#b8a67b]">
              {success.orderNumber}
            </p>

            <p className="mt-6 text-sm text-[#a9aa9f]">
              GESAMTBETRAG
            </p>

            <p className="mt-2 text-3xl font-black">
              {euro(success.total)}
            </p>

            <p className="mt-5 text-sm text-[#a9aa9f]">
              Zahlungsstatus: Offen
            </p>
          </div>

          <p className="mt-6 text-sm text-[#d6ceb9]">
            Dies ist ausschließlich ein technischer Test.
            Es wurde keine Zahlung ausgelöst und keine
            Bestellbestätigung versendet.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-lg bg-[#596347] px-8 py-4 font-black text-white"
          >
            ZUR STARTSEITE
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#10120e] px-4 py-10 text-[#e8dfca] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/warenkorb"
          className="mb-7 inline-block text-sm font-bold text-[#b8a67b] hover:underline"
        >
          ← ZURÜCK ZUM WARENKORB
        </Link>

        <div className="mb-9">
          <p className="mb-2 text-sm font-bold tracking-[0.25em] text-[#b8a67b]">
            BARRACKS SUPPLY CO.
          </p>

          <h1 className="text-3xl font-black sm:text-5xl">
            CHECKOUT
          </h1>

          <p className="mt-3 text-[#a9aa9f]">
            Gastbestellung – kein Kundenkonto erforderlich.
          </p>

          {TEST_MODE && (
            <p className="mt-4 rounded-lg border border-[#b8a67b] bg-[#2a291e] p-4 text-sm">
              TESTMODUS AKTIV – Es werden ausschließlich
              technische Testbestellungen gespeichert.
              Keine Zahlung und kein E-Mail-Versand.
              Bitte nur erfundene Kundendaten verwenden.
            </p>
          )}
        </div>

        {cart.length === 0 || totalQuantity === 0 ? (
          <div className="rounded-xl border border-[#596347] bg-[#1d211a] p-8 text-center">
            <h2 className="text-2xl font-black">
              DEIN WARENKORB IST LEER
            </h2>

            <p className="mt-3 text-[#a9aa9f]">
              Füge zuerst ein T-Shirt zu deinem Warenkorb hinzu.
            </p>

            <Link
              href="/t-shirts"
              className="mt-6 inline-block rounded-lg bg-[#596347] px-6 py-3 font-black text-white"
            >
              T-SHIRTS GESTALTEN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">

                <Section number="01" title="KONTAKTDATEN">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Vorname"
                      name="firstName"
                      value={customer.firstName}
                      onChange={update}
                      required
                      autoComplete="given-name"
                    />

                    <Field
                      label="Nachname"
                      name="lastName"
                      value={customer.lastName}
                      onChange={update}
                      required
                      autoComplete="family-name"
                    />

                    <Field
                      label="E-Mail-Adresse"
                      name="email"
                      type="email"
                      value={customer.email}
                      onChange={update}
                      required
                      autoComplete="email"
                    />

                    <Field
                      label="Telefonnummer"
                      name="phone"
                      type="tel"
                      value={customer.phone}
                      onChange={update}
                      autoComplete="tel"
                    />
                  </div>
                </Section>

                <Section number="02" title="LIEFERADRESSE">
                  <div className="space-y-4">
                    <Field
                      label="Firma (optional)"
                      name="company"
                      value={customer.company}
                      onChange={update}
                      autoComplete="organization"
                    />

                    <Field
                      label="UID-Nummer (optional)"
                      name="vatId"
                      value={customer.vatId}
                      onChange={update}
                    />

                    <Field
                      label="Straße und Hausnummer"
                      name="street"
                      value={customer.street}
                      onChange={update}
                      required
                      autoComplete="street-address"
                    />

                    <Field
                      label="Adresszusatz (optional)"
                      name="addressExtra"
                      value={customer.addressExtra}
                      onChange={update}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Postleitzahl"
                        name="postalCode"
                        value={customer.postalCode}
                        onChange={update}
                        required
                        autoComplete="postal-code"
                      />

                      <Field
                        label="Ort"
                        name="city"
                        value={customer.city}
                        onChange={update}
                        required
                        autoComplete="address-level2"
                      />
                    </div>

                    <label className="block">
                      <span className={labelClass}>
                        Lieferland *
                      </span>

                      <select
                        name="country"
                        className={fieldClass}
                        value={customer.country}
                        onChange={update}
                        required
                      >
                        {COUNTRIES.map((country) => (
                          <option
                            key={country.code}
                            value={country.code}
                          >
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    {customer.country === "CH" && (
                      <div className="rounded-lg border border-[#b8a67b] bg-[#2a291e] p-4 text-sm">
                        <strong>
                          Versand in die Schweiz
                        </strong>

                        <p className="mt-2 text-[#d6ceb9]">
                          Versandkosten und Zollbedingungen
                          werden noch geprüft. Ein
                          Bestellabschluss ist derzeit
                          nicht möglich.
                        </p>
                      </div>
                    )}
                  </div>
                </Section>

                <Section number="03" title="RECHNUNGSADRESSE">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="differentBilling"
                      checked={customer.differentBilling}
                      onChange={update}
                      className="h-5 w-5 accent-[#596347]"
                    />

                    <span>
                      Andere Rechnungsadresse verwenden
                    </span>
                  </label>

                  {customer.differentBilling && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Vorname"
                        name="billingFirstName"
                        value={customer.billingFirstName}
                        onChange={update}
                        required
                      />

                      <Field
                        label="Nachname"
                        name="billingLastName"
                        value={customer.billingLastName}
                        onChange={update}
                        required
                      />

                      <div className="sm:col-span-2">
                        <Field
                          label="Firma (optional)"
                          name="billingCompany"
                          value={customer.billingCompany}
                          onChange={update}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <Field
                          label="Straße und Hausnummer"
                          name="billingStreet"
                          value={customer.billingStreet}
                          onChange={update}
                          required
                        />
                      </div>

                      <Field
                        label="Postleitzahl"
                        name="billingPostalCode"
                        value={customer.billingPostalCode}
                        onChange={update}
                        required
                      />

                      <Field
                        label="Ort"
                        name="billingCity"
                        value={customer.billingCity}
                        onChange={update}
                        required
                      />

                      <label className="block sm:col-span-2">
                        <span className={labelClass}>
                          Rechnungsland *
                        </span>

                        <select
                          className={fieldClass}
                          name="billingCountry"
                          value={customer.billingCountry}
                          onChange={update}
                          required
                        >
                          {COUNTRIES.map((country) => (
                            <option
                              key={country.code}
                              value={country.code}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </Section>

                <Section number="04" title="ZAHLUNGSART">
                  <div className="space-y-3">
                    <label className="flex cursor-pointer gap-4 rounded-lg border border-[#596347] bg-[#10120e] p-4">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={payment === "bank"}
                        onChange={(event) =>
                          setPayment(event.target.value)
                        }
                        className="accent-[#b8a67b]"
                      />

                      <span>
                        <strong>
                          Banküberweisung (Vorkasse)
                        </strong>

                        <span className="mt-1 block text-sm text-[#a9aa9f]">
                          Die Zahlungsinformationen werden
                          vor dem echten Shopstart ergänzt.
                        </span>
                      </span>
                    </label>

                    <label className="flex gap-4 rounded-lg border border-[#596347] bg-[#10120e] p-4 opacity-60">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        disabled
                        className="accent-[#b8a67b]"
                      />

                      <span>
                        <strong>
                          PayPal – kommt demnächst
                        </strong>

                        <span className="mt-1 block text-sm text-[#a9aa9f]">
                          Die PayPal-Zahlungsanbindung
                          wird noch eingerichtet.
                        </span>
                      </span>
                    </label>
                  </div>
                </Section>

                <Section number="05" title="BESTELLHINWEISE">
                  <label className="block">
                    <span className={labelClass}>
                      Nachricht zur Bestellung (optional)
                    </span>

                    <textarea
                      name="note"
                      rows={4}
                      maxLength={1000}
                      className={fieldClass}
                      value={customer.note}
                      onChange={update}
                      placeholder="Besondere Hinweise zu deiner Bestellung ..."
                    />
                  </label>
                </Section>
              </div>

              <aside className="h-fit rounded-xl border border-[#596347] bg-[#1d211a] p-5 sm:p-7 lg:sticky lg:top-6">
                <h2 className="text-xl font-black">
                  DEINE BESTELLUNG
                </h2>

                <div className="mt-6 space-y-4">
                  {cart.map((item, index) => {
                    const quantity = Object.values(
                      item.sizes || {}
                    ).reduce(
                      (sum, value) =>
                        sum + (Number(value) || 0),
                      0
                    );

                    const sizes = Object.entries(
                      item.sizes || {}
                    )
                      .filter(
                        ([, amount]) => Number(amount) > 0
                      )
                      .map(
                        ([size, amount]) =>
                          `${size}: ${amount}`
                      )
                      .join(" · ");

                    return (
                      <div
                        key={item.id || index}
                        className="border-b border-[#414839] pb-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-bold">
                              Custom T-Shirt
                            </p>

                            <p className="mt-1 text-sm text-[#a9aa9f]">
                              {item.color?.name || "T-Shirt"}
                            </p>

                            <p className="mt-1 text-xs text-[#a9aa9f]">
                              {sizes}
                            </p>
                          </div>

                          <span className="whitespace-nowrap text-sm font-bold">
                            {quantity} Stk.
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span>
                      Artikel ({totalQuantity})
                    </span>

                    <strong>
                      {euro(subtotal)}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Versand ({countryName})
                    </span>

                    <strong>
                      {shipping === null
                        ? "Noch offen"
                        : shipping === 0
                          ? "GRATIS"
                          : euro(shipping)}
                    </strong>
                  </div>

                  <div className="border-t border-[#596347] pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-black">
                        GESAMT
                      </span>

                      <span className="text-2xl font-black text-[#b8a67b]">
                        {grandTotal === null
                          ? "Noch offen"
                          : euro(grandTotal)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-[#a9aa9f]">
                      Vorläufige Preisübersicht.
                      Der Server berechnet den
                      endgültigen Betrag erneut.
                    </p>
                  </div>
                </div>

                <label className="mt-7 flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={customer.acceptTerms}
                    onChange={update}
                    className="mt-1 h-4 w-4 accent-[#596347]"
                  />

                  <span>
                    Ich bestätige, dass ich mich im
                    technischen Testbetrieb befinde.
                    Die erforderlichen Rechtstexte
                    werden vor dem Shopstart ergänzt.
                  </span>
                </label>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-red-500 bg-red-950/40 p-4 text-sm text-red-200"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canTestOrder}
                  className={`mt-6 w-full rounded-lg bg-[#596347] px-5 py-4 text-lg font-black text-white ${
                    !canTestOrder
                      ? "cursor-not-allowed opacity-60"
                      : "hover:bg-[#6c7956]"
                  }`}
                >
                  {submitting
                    ? "TESTBESTELLUNG WIRD GESPEICHERT ..."
                    : TEST_MODE
                      ? "TESTBESTELLUNG SPEICHERN – KEINE ZAHLUNG"
                      : "BESTELLFUNKTION NOCH NICHT AKTIV"}
                </button>

                <p className="mt-4 text-center text-xs text-[#a9aa9f]">
                  {TEST_MODE
                    ? "Nur für interne Tests. Keine Zahlung und kein E-Mail-Versand."
                    : "Noch keine Bestellung oder Zahlung möglich. Deine Warenkorbdaten bleiben erhalten."}
                </p>

                <Link
                  href="/warenkorb"
                  className="mt-5 block text-center text-sm font-bold text-[#b8a67b] hover:underline"
                >
                  Warenkorb bearbeiten
                </Link>
              </aside>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
