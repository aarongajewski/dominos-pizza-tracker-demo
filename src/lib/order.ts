import {
  CRUSTS,
  DELIVERY_FEE,
  SIZES,
  TAX_RATE,
  TOPPINGS,
  findCrust,
  findSize,
  findTopping,
} from "../data/menu";
import type {
  CartPizza,
  CustomerInfo,
  Order,
  SizeId,
} from "../types";

export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Human-friendly order number for the tracker header. */
export function makeOrderNumber(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function pizzaPrice(pizza: CartPizza): number {
  const size = findSize(pizza.size);
  const crust = findCrust(pizza.crust);
  const toppings = pizza.toppingIds.reduce((sum, id) => {
    return sum + (findTopping(id)?.price ?? 0);
  }, 0);
  return (size.basePrice + crust.priceDelta + toppings) * pizza.quantity;
}

export function cartSubtotal(pizzas: CartPizza[]): number {
  return pizzas.reduce((sum, p) => sum + pizzaPrice(p), 0);
}

export function pizzaLabel(pizza: CartPizza): string {
  const size = findSize(pizza.size);
  const crust = findCrust(pizza.crust);
  if (pizza.name) return pizza.name;
  return `${size.label} ${crust.label} Pizza`;
}

export function toppingLabels(pizza: CartPizza): string[] {
  return pizza.toppingIds
    .map((id) => findTopping(id)?.label)
    .filter((x): x is string => Boolean(x));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function newPizza(): CartPizza {
  return {
    id: makeId("pizza"),
    name: "",
    size: "medium",
    crust: "hand-tossed",
    toppingIds: ["pepperoni"],
    quantity: 1,
  };
}

/** Build a finalized Order from a cart + customer info + tip. */
export function buildOrder(
  pizzas: CartPizza[],
  customer: CustomerInfo,
  tip = 0
): Order {
  const subtotal = round2(cartSubtotal(pizzas));
  const deliveryFee = customer.mode === "delivery" ? DELIVERY_FEE : 0;
  const tax = round2(subtotal * TAX_RATE);
  const tipAmount = round2(Math.max(0, tip));
  const total = round2(subtotal + deliveryFee + tax + tipAmount);
  return {
    id: makeOrderNumber(),
    pizzas,
    customer,
    subtotal,
    deliveryFee,
    tax,
    tip: tipAmount,
    total,
    placedAt: Date.now(),
    etaMinutes: customer.mode === "delivery" ? 30 : 18,
  };
}

/** A ready-to-go order so the demo can skip straight to the tracker. */
export function cannedCart(): CartPizza[] {
  return [
    {
      id: makeId("pizza"),
      name: "The Cursor Classic",
      size: "large",
      crust: "hand-tossed",
      toppingIds: ["pepperoni", "sausage", "mushroom"],
      quantity: 1,
    },
    {
      id: makeId("pizza"),
      name: "Veggie Supreme",
      size: "medium",
      crust: "thin",
      toppingIds: ["mushroom", "onion", "pepper", "olive"],
      quantity: 1,
    },
  ];
}

export function cannedCustomer(): CustomerInfo {
  return {
    name: "Alex Rivera",
    address: "30 Domino Farms Blvd, Ann Arbor, MI",
    mode: "delivery",
  };
}

// Re-export for convenience so screens can import from one place.
export { SIZES, CRUSTS, TOPPINGS };
export type { SizeId };
