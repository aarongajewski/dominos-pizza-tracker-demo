import type { TrackerStatus } from "../types";

export interface TrackerStep {
  status: TrackerStatus;
  label: string;
  /** Short line shown under the active step. */
  blurb: (name: string) => string;
  icon: string;
  /** Fraction of total ETA that has elapsed when this step *starts*. */
  startFraction: number;
}

export const TRACKER_STEPS: TrackerStep[] = [
  {
    status: "received",
    label: "Order Received",
    blurb: () => "We've got your order and sent it to the kitchen.",
    icon: "receipt",
    startFraction: 0,
  },
  {
    status: "prep",
    label: "Prep",
    blurb: (name) => `${name || "Our team"} is stretching dough and adding toppings.`,
    icon: "chef",
    startFraction: 0.2,
  },
  {
    status: "bake",
    label: "Bake",
    blurb: () => "Your pizza is in the 450° oven. Almost there!",
    icon: "oven",
    startFraction: 0.45,
  },
  {
    status: "out-for-delivery",
    label: "Out for Delivery",
    blurb: () => "Your driver is on the way with your order.",
    icon: "car",
    startFraction: 0.7,
  },
  {
    status: "delivered",
    label: "Delivered",
    blurb: () => "Enjoy! Thanks for ordering from Demo Pizza.",
    icon: "check",
    startFraction: 1,
  },
];

export function stepIndex(status: TrackerStatus): number {
  return TRACKER_STEPS.findIndex((s) => s.status === status);
}

export function nextStatus(status: TrackerStatus): TrackerStatus {
  const i = stepIndex(status);
  if (i < 0 || i >= TRACKER_STEPS.length - 1) return status;
  return TRACKER_STEPS[i + 1].status;
}

export function isFinal(status: TrackerStatus): boolean {
  return status === "delivered";
}

/**
 * Overall progress across the whole timeline (0..1), based on the current
 * step plus how far we are into that step by elapsed time.
 */
export function overallProgress(status: TrackerStatus): number {
  const i = stepIndex(status);
  if (i < 0) return 0;
  return i / (TRACKER_STEPS.length - 1);
}
