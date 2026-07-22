export type SizeId = "small" | "medium" | "large";
export type CrustId = "hand-tossed" | "thin" | "pan";

export interface SizeOption {
  id: SizeId;
  label: string;
  inches: number;
  basePrice: number;
}

export interface CrustOption {
  id: CrustId;
  label: string;
  priceDelta: number;
}

export interface Topping {
  id: string;
  label: string;
  price: number;
  veg: boolean;
}

/** A single configured pizza in the cart. */
export interface CartPizza {
  id: string;
  name: string;
  size: SizeId;
  crust: CrustId;
  toppingIds: string[];
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  mode: "delivery" | "carryout";
}

/** The five tracker states, in order. */
export type TrackerStatus =
  | "received"
  | "prep"
  | "bake"
  | "out-for-delivery"
  | "delivered";

export interface Order {
  id: string;
  pizzas: CartPizza[];
  customer: CustomerInfo;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  /** Tip amount in dollars (computed from subtotal % or custom). */
  tip: number;
  total: number;
  placedAt: number;
  /** Total minutes the demo pretends the order will take. */
  etaMinutes: number;
}

export type Screen = "menu" | "checkout" | "tracker";
