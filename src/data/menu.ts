import type { CrustOption, SizeOption, Topping } from "../types";

export const SIZES: SizeOption[] = [
  { id: "small", label: "Small", inches: 10, basePrice: 8.99 },
  { id: "medium", label: "Medium", inches: 12, basePrice: 10.99 },
  { id: "large", label: "Large", inches: 14, basePrice: 12.99 },
];

export const CRUSTS: CrustOption[] = [
  { id: "hand-tossed", label: "Hand Tossed", priceDelta: 0 },
  { id: "thin", label: "Thin Crust", priceDelta: 0 },
  { id: "pan", label: "Pan", priceDelta: 1.5 },
];

// Deliberately a limited set to keep the demo fast and reliable.
export const TOPPINGS: Topping[] = [
  { id: "pepperoni", label: "Pepperoni", price: 1.5, veg: false },
  { id: "sausage", label: "Italian Sausage", price: 1.5, veg: false },
  { id: "chicken", label: "Grilled Chicken", price: 1.75, veg: false },
  { id: "bacon", label: "Bacon", price: 1.75, veg: false },
  { id: "mushroom", label: "Mushrooms", price: 1.0, veg: true },
  { id: "onion", label: "Onions", price: 0.75, veg: true },
  { id: "pepper", label: "Green Peppers", price: 0.75, veg: true },
  { id: "olive", label: "Black Olives", price: 1.0, veg: true },
  { id: "pineapple", label: "Pineapple", price: 1.0, veg: true },
  { id: "jalapeno", label: "Jalapeños", price: 0.75, veg: true },
];

export const DELIVERY_FEE = 3.99;
export const TAX_RATE = 0.08;

export function findSize(id: string): SizeOption {
  return SIZES.find((s) => s.id === id) ?? SIZES[1];
}

export function findCrust(id: string): CrustOption {
  return CRUSTS.find((c) => c.id === id) ?? CRUSTS[0];
}

export function findTopping(id: string): Topping | undefined {
  return TOPPINGS.find((t) => t.id === id);
}
