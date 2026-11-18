export const SIZES = ["S", "M", "L", "XL", "XXL"];
export const BASE_PRICE = 19.9;
export const BULK_PRICE = 14.99;
export const BULK_MIN_QUANTITY = 10;
export const SINGLE_MOTIF_PRICE = 5;
export const MULTI_MOTIF_PRICE = 4;

export function quantityOf(item) {
  return SIZES.reduce((sum, size) => sum + Math.max(0, Math.floor(Number(item?.sizes?.[size]) || 0)), 0);
}
export function cartQuantity(cart) {
  return cart.filter((item) => item?.type === "custom-tshirt").reduce((sum, item) => sum + quantityOf(item), 0);
}
export function priceForItem(item, totalShirts) {
  const quantity = quantityOf(item);
  const count = (item?.motifs?.front?.length || 0) + (item?.motifs?.back?.length || 0);
  const basePrice = totalShirts >= BULK_MIN_QUANTITY ? BULK_PRICE : BASE_PRICE;
  const motifUnitPrice = count >= 2 ? MULTI_MOTIF_PRICE : SINGLE_MOTIF_PRICE;
  const motifsPrice = count * motifUnitPrice;
  const pricePerShirt = Math.round((basePrice + motifsPrice) * 100) / 100;
  return { quantity, basePrice, motifUnitPrice, motifsPrice, pricePerShirt, totalPrice: Math.round(pricePerShirt * quantity * 100) / 100 };
}
export function repriceCart(cart) {
  const totalShirts = cartQuantity(cart);
  return cart.map((item) => item?.type === "custom-tshirt" ? { ...item, ...priceForItem(item, totalShirts) } : item);
}
export function euro(value) {
  return Number(value || 0).toLocaleString("de-AT", { style: "currency", currency: "EUR" });
}