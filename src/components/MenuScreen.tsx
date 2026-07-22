import { CRUSTS, SIZES, TOPPINGS } from "../data/menu";
import { cartSubtotal, newPizza, pizzaLabel, pizzaPrice } from "../lib/order";
import type { CartPizza, CrustId, SizeId } from "../types";

interface MenuScreenProps {
  cart: CartPizza[];
  setCart: (updater: (prev: CartPizza[]) => CartPizza[]) => void;
  onCheckout: () => void;
  onLoadCanned: () => void;
}

export function MenuScreen({ cart, setCart, onCheckout, onLoadCanned }: MenuScreenProps) {
  const update = (id: string, patch: Partial<CartPizza>) =>
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const toggleTopping = (id: string, toppingId: string) =>
    setCart((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const has = p.toppingIds.includes(toppingId);
        return {
          ...p,
          toppingIds: has
            ? p.toppingIds.filter((t) => t !== toppingId)
            : [...p.toppingIds, toppingId],
        };
      })
    );

  const addPizza = () => setCart((prev) => [...prev, newPizza()]);
  const removePizza = (id: string) =>
    setCart((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));

  const subtotal = cartSubtotal(cart);
  const canCheckout = cart.length > 0;

  return (
    <div className="menu">
      <div className="menu-intro">
        <div>
          <h1 className="page-title">Build your order</h1>
          <p className="page-sub">
            Pick a size, crust, and toppings — or skip ahead with a canned order.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onLoadCanned}>
          ⚡ Load canned order
        </button>
      </div>

      <div className="menu-grid">
        <div className="builder">
          {cart.map((pizza, idx) => (
            <div className="pizza-card" key={pizza.id}>
              <div className="pizza-card-head">
                <h2>{pizza.name || `Pizza ${idx + 1}`}</h2>
                <div className="pizza-card-head-right">
                  <span className="price-tag">${pizzaPrice(pizza).toFixed(2)}</span>
                  {cart.length > 1 && (
                    <button
                      className="link-danger"
                      onClick={() => removePizza(pizza.id)}
                      aria-label="Remove pizza"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Size</label>
                <div className="chip-row">
                  {SIZES.map((s) => (
                    <button
                      key={s.id}
                      className={`chip ${pizza.size === s.id ? "chip-active" : ""}`}
                      onClick={() => update(pizza.id, { size: s.id as SizeId })}
                    >
                      {s.label}
                      <span className="chip-meta">{s.inches}"</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Crust</label>
                <div className="chip-row">
                  {CRUSTS.map((c) => (
                    <button
                      key={c.id}
                      className={`chip ${pizza.crust === c.id ? "chip-active" : ""}`}
                      onClick={() => update(pizza.id, { crust: c.id as CrustId })}
                    >
                      {c.label}
                      {c.priceDelta > 0 && (
                        <span className="chip-meta">+${c.priceDelta.toFixed(2)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label className="field-label">
                  Toppings <span className="muted">({pizza.toppingIds.length} selected)</span>
                </label>
                <div className="topping-grid">
                  {TOPPINGS.map((t) => {
                    const active = pizza.toppingIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        className={`topping ${active ? "topping-active" : ""}`}
                        onClick={() => toggleTopping(pizza.id, t.id)}
                        aria-pressed={active}
                      >
                        <span className={`veg-dot ${t.veg ? "veg" : "meat"}`} aria-hidden />
                        <span className="topping-label">{t.label}</span>
                        <span className="topping-price">+${t.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="field field-inline">
                <label className="field-label">Quantity</label>
                <div className="stepper">
                  <button
                    className="stepper-btn"
                    onClick={() =>
                      update(pizza.id, { quantity: Math.max(1, pizza.quantity - 1) })
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="stepper-value">{pizza.quantity}</span>
                  <button
                    className="stepper-btn"
                    onClick={() =>
                      update(pizza.id, { quantity: Math.min(9, pizza.quantity + 1) })
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="btn btn-outline btn-block" onClick={addPizza}>
            + Add another pizza
          </button>
        </div>

        <aside className="summary">
          <h2 className="summary-title">Your order</h2>
          <ul className="summary-list">
            {cart.map((p) => (
              <li key={p.id}>
                <span className="summary-item-name">
                  {p.quantity > 1 ? `${p.quantity}× ` : ""}
                  {pizzaLabel(p)}
                </span>
                <span>${pizzaPrice(p).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="muted small">Taxes &amp; delivery calculated at checkout.</p>
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={onCheckout}
            disabled={!canCheckout}
          >
            Checkout →
          </button>
        </aside>
      </div>
    </div>
  );
}
