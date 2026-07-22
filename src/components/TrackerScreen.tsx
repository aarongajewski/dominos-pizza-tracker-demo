import { useEffect, useState } from "react";
import { TRACKER_STEPS, isFinal, overallProgress, stepIndex } from "../lib/tracker";
import { pizzaLabel, pizzaPrice, toppingLabels } from "../lib/order";
import type { Order, TrackerStatus } from "../types";

interface TrackerScreenProps {
  order: Order;
  status: TrackerStatus;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  onAdvance: () => void;
  onNewOrder: () => void;
}

const ICONS: Record<string, string> = {
  receipt: "🧾",
  chef: "👩‍🍳",
  oven: "🔥",
  car: "🚗",
  check: "✅",
};

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function TrackerScreen({
  order,
  status,
  autoAdvance,
  onToggleAutoAdvance,
  onAdvance,
  onNewOrder,
}: TrackerScreenProps) {
  const activeIndex = stepIndex(status);
  const progress = overallProgress(status);
  const done = isFinal(status);

  // Re-render each second so the "arriving by" feels live.
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const minutesRemaining = Math.max(0, Math.round((1 - progress) * order.etaMinutes));
  const arriveBy = formatClock(order.placedAt + order.etaMinutes * 60_000);
  const activeStep = TRACKER_STEPS[activeIndex];
  const verb = order.customer.mode === "delivery" ? "delivery" : "pickup";

  return (
    <div className="tracker">
      <div className="tracker-hero">
        <div className="tracker-hero-text">
          <p className="tracker-eyebrow">Order #{order.id}</p>
          <h1 className="tracker-headline">
            {done ? (
              <>Delivered — enjoy! 🍕</>
            ) : (
              <>
                Estimated {verb} in <span className="tracker-eta">{minutesRemaining} min</span>
              </>
            )}
          </h1>
          <p className="tracker-subline">
            {done
              ? `Order completed at ${formatClock(Date.now())}.`
              : `Arriving by about ${arriveBy} · ${order.customer.mode === "delivery" ? order.customer.address : "Carryout"}`}
          </p>
        </div>
        <div className={`tracker-ring ${done ? "tracker-ring-done" : ""}`} aria-hidden>
          <span className="tracker-ring-num">{activeIndex + 1}/5</span>
        </div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <ol className="steps">
        {TRACKER_STEPS.map((step, i) => {
          const state =
            i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          return (
            <li key={step.status} className={`step step-${state}`}>
              <div className="step-icon" aria-hidden>
                {state === "done" ? "✓" : ICONS[step.icon]}
              </div>
              <div className="step-body">
                <span className="step-label">{step.label}</span>
                {i === activeIndex && (
                  <span className="step-blurb">{step.blurb(order.customer.name)}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="tracker-controls">
        <button
          className="btn btn-primary"
          onClick={onAdvance}
          disabled={done}
          title="Advance to the next status"
        >
          {done ? "Delivered" : `Advance to ${TRACKER_STEPS[activeIndex + 1]?.label ?? ""}`}
        </button>
        <label className="switch">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={onToggleAutoAdvance}
          />
          <span className="switch-track" aria-hidden />
          <span className="switch-label">Auto-advance</span>
        </label>
        <button className="btn btn-ghost" onClick={onNewOrder}>
          Start new order
        </button>
      </div>

      <section className="tracker-summary">
        <h2 className="summary-title">Order summary</h2>
        <div className="tracker-summary-grid">
          <ul className="summary-list">
            {order.pizzas.map((p) => (
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
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{order.customer.mode === "delivery" ? "Delivery fee" : "Carryout"}</span>
              <span>{order.deliveryFee ? `$${order.deliveryFee.toFixed(2)}` : "Free"}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <p className="active-note muted small">{activeStep.blurb(order.customer.name)}</p>
      </section>
    </div>
  );
}
