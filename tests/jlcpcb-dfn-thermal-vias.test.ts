import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import {
  circuitJsonToFootprint,
  circuitJsonToFootprinter,
  footprinterStringToFootprint,
  summarizeCopperComparison,
} from "../lib/index.js"
import { c81582CircuitJson } from "./fixture/c81582.js"

test.each([0, 90])(
  "recovers C81582's twelve thermal vias at %d degrees",
  (rotation) => {
    const circuitJson: AnyCircuitElement[] = c81582CircuitJson.map(
      (element) => {
        if (rotation === 0) return element
        if (element.type === "pcb_via") {
          return { ...element, x: -element.y, y: element.x }
        }
        if (
          element.type === "pcb_smtpad" &&
          (element.shape === "rect" || element.shape === "pill")
        ) {
          return {
            ...element,
            x: -element.y,
            y: element.x,
            width: element.height,
            height: element.width,
          }
        }
        return element
      },
    )
    const target = circuitJsonToFootprint(circuitJson)
    const { best } = circuitJsonToFootprinter(circuitJson, {
      sourceHints: ["C81582 DRV8825PWPR HTSSOP-28-EP"],
    })

    expect(best).not.toBeNull()
    expect(best!.family).toBe("dfn")
    expect(best!.footprinterString).toContain("_thermalvias")
    expect(best!.copperIntersectionOverUnion).toBeGreaterThan(0.99)
    // The source has a slightly offset via, so its regular-grid approximation
    // is not a perfect drill match. A pad-only match previously scored zero.
    expect(best!.holeIntersectionOverUnion).toBeGreaterThan(0.98)

    const recovered = footprinterStringToFootprint(best!.footprinterString)
    expect(recovered.pads).toHaveLength(29)
    expect(recovered.vias).toHaveLength(12)
    for (const via of recovered.vias) {
      // Generated dimension strings round the EasyEDA conversion precision.
      expect(via.hole_diameter).toBeCloseTo(0.3000248, 4)
      expect(via.outer_diameter).toBeCloseTo(0.5000244, 4)
      expect(via.layers).toEqual(["top", "bottom"])
    }
    const comparison = summarizeCopperComparison(recovered, target)
    expect(comparison.holeIntersectionOverUnion).toBeGreaterThan(0.98)

    expect(
      convertCircuitJsonToPcbSvg([...recovered.pads, ...recovered.vias]),
    ).toMatchSvgSnapshot(import.meta.path, `C81582-thermal-vias-${rotation}`)
  },
  30_000,
)
