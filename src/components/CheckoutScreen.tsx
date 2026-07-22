import { useState } from "react";
import { DELIVERY_FEE, TAX_RATE } from "../data/menu";
import {
  cartSubtotal,
  pizzaLabel,
  pizzaPrice,
  round2,
  tipFromPercent,
  toppingLabels,
} from "../lib/order";
import type { CartPizza, CustomerInfo } from "../types";

type TipChoice = "15" | "18" | "20" | "none" | "custom";

interface CheckoutScreenProps {
  cart: CartPizza[];
  onBack: () => void;
  onPlaceOrder: (customer: CustomerInfo, tip: number) => void;
}

export function CheckoutScreen({ cart, onBack, onPlaceOrder }: CheckoutScreenProps) {
  const [name, setName] = useState("Alex Rivera");
  const [mode, setMode] = useState<"delivery" | "carryout">("delivery");
  const [address, setAddress] = useState("30 Domino Farms Blvd, Ann Arbor, MI");
  const [tipChoice, setTipChoice] = useState<TipChoice>("18");
  const [customTip, setCustomTip] = useState("");

  const subtotal = round2(cartSubtotal(cart));
  const deliveryFee = mode === "delivery" ? DELIVERY_FEE : 0;
  const tax = round2(subtotal * TAX_RATE);

  let tip = 0;
  if (tipChoice === "15") tip = tipFromPercent(subtotal, 15);
  else if (tipChoice === "18") tip = tipFromPercent(subtotal, 18);
  else if (tipChoice === "20") tip = tipFromPercent(subtotal, 20);
  else if (tipChoice === "custom") {
    const parsed = Number.parseFloat(customTip);
    tip = Number.isFinite(parsed) && parsed > 0 ? round2(parsed) : 0;
  }

  const total = round2(subtotal + deliveryFee + tax + tip);

  const addressNeeded = mode === "delivery";
  const canPlace = name.trim().length > 0 && (!addressNeeded || address.trim().length > 0);

  const submit = () => {
    if (!canPlace) return;
    onPlaceOrder({ name: name.trim(), address: address.trim(), mode }, tip);
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

          <div className="field">
            <label className="field-label">Tip</label>
            <div className="chip-row">
              <button
                type="button"
                className={`chip ${tipChoice === "15" ? "chip-active" : ""}`}
                onClick={() => setTipChoice("15")}
              >
                15%
                <span className="chip-meta">${tipFromPercent(subtotal, 15).toFixed(2)}</span>
              </button>
              <button
                type="button"
                className={`chip ${tipChoice === "18" ? "chip-active" : ""}`}
                onClick={() => setTipChoice("18")}
              >
                18%
                <span className="chip-meta">${tipFromPercent(subtotal, 18).toFixed(2)}</span>
              </button>
              <button
                type="button"
                className={`chip ${tipChoice === "20" ? "chip-active" : ""}`}
                onClick={() => setTipChoice("20")}
              >
                20%
                <span className="chip-meta">${tipFromPercent(subtotal, 20).toFixed(2)}</span>
              </button>
              <button
                type="button"
                className={`chip ${tipChoice === "none" ? "chip-active" : ""}`}
                onClick={() => setTipChoice("none")}
              >
                No tip
              </button>
              <button
                type="button"
                className={`chip ${tipChoice === "custom" ? "chip-active" : ""}`}
                onClick={() => setTipChoice("custom")}
              >
                Custom
              </button>
            </div>
            {tipChoice === "custom" && (
              <input
                id="custom-tip"
                className="text-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="Dollar amount"
                aria-label="Custom tip amount"
                style={{ marginTop: 8 }}
              />
            )}
          </div>

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
            <div className="summary-row">
              <span>Tip</span>
              <span>${tip.toFixed(2)}</span>
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
