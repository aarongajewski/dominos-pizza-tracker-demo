import { useState } from "react";
import { DELIVERY_FEE, TAX_RATE } from "../data/menu";
import { cartSubtotal, pizzaLabel, pizzaPrice, round2, toppingLabels } from "../lib/order";
import type { CartPizza, CustomerInfo } from "../types";

interface CheckoutScreenProps {
  cart: CartPizza[];
  onBack: () => void;
  onPlaceOrder: (customer: CustomerInfo) => void;
}

export function CheckoutScreen({ cart, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const [name, setName] = useState("Alex Rivera");
  const [mode, setMode] = useState<"delivery" | "carryout">("delivery");
  const [address, setAddress] = useState("30 Domino Farms Blvd, Ann Arbor, MI");

  const subtotal = round2(cartSubtotal(cart));
  const deliveryFee = mode === "delivery" ? DELIVERY_FEE : 0;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + deliveryFee + tax);

  const addressNeeded = mode === "delivery";
  const canPlace = name.trim().length > 0 && (!addressNeeded || address.trim().length > 0);

  const submit = () => {
    if (!canPlace) return;
    onPlaceOrder({ name: name.trim(), address: address.trim(), mode });
  };

  return (
    <div className="checkout">
      <button className="back-link" onClick={onBack}>
        ← Back to menu
      </button>
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-grid">
        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="field">
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="field-label">Order type</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${mode === "delivery" ? "chip-active" : ""}`}
                onClick={() => setMode("delivery")}
              >
                🚗 Delivery
              </button>
              <button
                type="button"
                className={`chip ${mode === "carryout" ? "chip-active" : ""}`}
                onClick={() => setMode("carryout")}
              >
                🏪 Carryout
              </button>
            </div>
          </div>

          {addressNeeded && (
            <div className="field">
              <label className="field-label" htmlFor="address">
                Delivery address
              </label>
              <input
                id="address"
                className="text-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State"
                autoComplete="off"
              />
            </div>
          )}

          <p className="muted small">
            This is a demo — no payment is collected and no data leaves your browser.
          </p>
        </form>

        <aside className="summary">
          <h2 className="summary-title">Order summary</h2>
          <ul className="summary-list">
            {cart.map((p) => (
              <li key={p.id} className="summary-line">
                <div>
                  <span className="summary-item-name">
                    {p.quantity > 1 ? `${p.quantity}× ` : ""}
                    {pizzaLabel(p)}
                  </span>
                  <span className="summary-item-detail">
                    {toppingLabels(p).join(", ") || "Cheese"}
                  </span>
                </div>
                <span>${pizzaPrice(p).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{mode === "delivery" ? "Delivery fee" : "Carryout"}</span>
              <span>{deliveryFee ? `$${deliveryFee.toFixed(2)}` : "Free"}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={submit}
            disabled={!canPlace}
          >
            Place order
          </button>
        </aside>
      </div>
    </div>
  );
}
