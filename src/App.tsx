import { useCallback, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { MenuScreen } from "./components/MenuScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";
import { TrackerScreen } from "./components/TrackerScreen";
import { DebugPanel } from "./components/DebugPanel";
import { buildOrder, cannedCart, cannedCustomer, newPizza, round2 } from "./lib/order";
import type { CartPizza, CustomerInfo, Order, Screen, TrackerStatus } from "./types";

type Theme = "light" | "dark";

const STORAGE_KEY = "demo-pizza-tracker/v1";

interface PersistedState {
  screen: Screen;
  cart: CartPizza[];
  order: Order | null;
  status: TrackerStatus;
  theme: Theme;
  autoAdvance: boolean;
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

/** Auto-advance interval (ms) so a live demo moves through states hands-free. */
const AUTO_ADVANCE_MS = 6000;

export function App() {
  const saved = loadState();

  const [screen, setScreen] = useState<Screen>(saved.screen ?? "menu");
  const [cart, setCart] = useState<CartPizza[]>(
    saved.cart && saved.cart.length ? saved.cart : [newPizza()]
  );
  const [order, setOrder] = useState<Order | null>(saved.order ?? null);
  const [status, setStatus] = useState<TrackerStatus>(saved.status ?? "received");
  const [theme, setTheme] = useState<Theme>(saved.theme ?? "light");
  const [autoAdvance, setAutoAdvance] = useState<boolean>(saved.autoAdvance ?? true);
  const [debugOpen, setDebugOpen] = useState(false);

  // Keep the <html data-theme> in sync for CSS theming.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Persist state so a refresh mid-demo doesn't lose the order.
  useEffect(() => {
    const toSave: PersistedState = { screen, cart, order, status, theme, autoAdvance };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* ignore quota/private-mode errors */
    }
  }, [screen, cart, order, status, theme, autoAdvance]);

  const advance = useCallback(() => {
    setStatus((cur) => {
      const order: TrackerStatus[] = [
        "received",
        "prep",
        "bake",
        "out-for-delivery",
        "delivered",
      ];
      const i = order.indexOf(cur);
      return i < order.length - 1 ? order[i + 1] : cur;
    });
  }, []);

  // Auto-advance through the tracker while on the tracker screen.
  useEffect(() => {
    if (screen !== "tracker" || !autoAdvance) return;
    if (status === "delivered") return;
    const t = setInterval(advance, AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [screen, autoAdvance, status, advance]);

  const placeOrder = useCallback((customer: CustomerInfo, tip: number) => {
    setOrder(buildOrder(cart, customer, tip));
    setStatus("received");
    setScreen("tracker");
  }, [cart]);

  const loadCannedOrder = useCallback(() => {
    const c = cannedCart();
    setCart(c);
    // Default demo tip: 18% of subtotal (matches checkout default).
    const draft = buildOrder(c, cannedCustomer(), 0);
    setOrder(buildOrder(c, cannedCustomer(), round2(draft.subtotal * 0.18)));
    setStatus("received");
    setScreen("tracker");
  }, []);

  const resetDemo = useCallback(() => {
    setOrder(null);
    setCart([newPizza()]);
    setStatus("received");
    setScreen("menu");
    setAutoAdvance(true);
  }, []);

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onOpenDebug={() => setDebugOpen(true)}
        onHome={resetDemo}
      />

      <main className="main">
        {screen === "menu" && (
          <MenuScreen
            cart={cart}
            setCart={setCart}
            onCheckout={() => setScreen("checkout")}
            onLoadCanned={loadCannedOrder}
          />
        )}

        {screen === "checkout" && (
          <CheckoutScreen
            cart={cart}
            onBack={() => setScreen("menu")}
            onPlaceOrder={placeOrder}
          />
        )}

        {screen === "tracker" && order && (
          <TrackerScreen
            order={order}
            status={status}
            autoAdvance={autoAdvance}
            onToggleAutoAdvance={() => setAutoAdvance((a) => !a)}
            onAdvance={advance}
            onNewOrder={resetDemo}
          />
        )}

        {screen === "tracker" && !order && (
          <div className="empty-state">
            <p>No active order.</p>
            <button className="btn btn-primary" onClick={resetDemo}>
              Start an order
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>
          Demo Pizza Tracker — a Cursor discovery demo. Domino's-inspired styling,
          <strong> not affiliated with or endorsed by Domino's</strong>.
        </span>
      </footer>

      {debugOpen && (
        <DebugPanel
          screen={screen}
          status={status}
          autoAdvance={autoAdvance}
          onClose={() => setDebugOpen(false)}
          onReset={resetDemo}
          onLoadCanned={loadCannedOrder}
          onSetStatus={setStatus}
          onGoto={setScreen}
          onToggleAutoAdvance={() => setAutoAdvance((a) => !a)}
        />
      )}
    </div>
  );
}
