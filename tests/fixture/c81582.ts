import type { AnyCircuitElement, PcbSmtPad, PcbVia } from "circuit-json"

// C81582 / DRV8825PWPR, exact EasyEDA footprint import.
// Package UUID: 26071c9fef5e4e48bd9ebf04133c5d9d
// Retain the small source-coordinate deviations, including the via at x=1.778.
const leadPositions = [
  [1, -4.225036, -2.865755],
  [2, -3.57505, -2.865755],
  [3, -2.925064, -2.865755],
  [4, -2.275078, -2.865755],
  [5, -1.625092, -2.865755],
  [6, -0.975106, -2.865755],
  [7, -0.324866, -2.865755],
  [8, 0.32512, -2.865755],
  [9, 0.975106, -2.865755],
  [10, 1.625092, -2.865755],
  [11, 2.275078, -2.865755],
  [12, 2.925064, -2.865755],
  [13, 3.57505, -2.865755],
  [14, 4.225036, -2.865755],
  [28, -4.225036, 2.865755],
  [27, -3.57505, 2.865755],
  [26, -2.925064, 2.865755],
  [25, -2.275078, 2.865755],
  [24, -1.625092, 2.865755],
  [23, -0.975106, 2.865755],
  [22, -0.324866, 2.865755],
  [21, 0.32512, 2.865755],
  [20, 0.975106, 2.865755],
  [19, 1.625092, 2.865755],
  [18, 2.275078, 2.865755],
  [17, 2.925064, 2.865755],
  [16, 3.57505, 2.865755],
  [15, 4.225036, 2.865755],
]
const leads: PcbSmtPad[] = leadPositions.map(([pin, x, y]) => ({
  type: "pcb_smtpad",
  pcb_smtpad_id: `pcb_smtpad_${pin}`,
  port_hints: [`pin${pin}`],
  layer: "top",
  shape: "pill",
  width: 0.3430016,
  height: 1.7314926,
  radius: 0.1715008,
  x,
  y,
}))

const thermalPad: PcbSmtPad = {
  type: "pcb_smtpad",
  pcb_smtpad_id: "pcb_smtpad_29",
  port_hints: ["pin29"],
  layer: "top",
  shape: "rect",
  width: 5.5999888,
  height: 3.0999938,
  x: 0,
  y: -0.000127,
}

const viaPositions = [
  [1.800098, -1.200023],
  [-0.599948, -0.000127],
  [0.599948, -1.200023],
  [-0.599948, -1.200023],
  [-0.599948, 1.200023],
  [-1.800098, -1.200023],
  [-1.800098, -0.000127],
  [-1.800098, 1.200023],
  [0.599948, -0.000127],
  [1.778, -0.000127],
  [0.599948, 1.200023],
  [1.800098, 1.200023],
]
const vias: PcbVia[] = viaPositions.map(([x, y], index) => ({
  type: "pcb_via",
  pcb_via_id: `pcb_via_${index + 1}`,
  layers: ["top", "bottom"],
  hole_diameter: 0.3000248,
  outer_diameter: 0.5000244,
  x,
  y,
}))

export const c81582CircuitJson: AnyCircuitElement[] = [
  ...leads,
  thermalPad,
  ...vias,
]
