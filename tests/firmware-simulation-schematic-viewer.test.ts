import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { FirmwareSimulationSchematicViewer } from "../lib/components/FirmwareSimulationSchematicViewer"

test("renders physical firmware inputs and outputs with power state", () => {
  const markup = renderToStaticMarkup(
    createElement(FirmwareSimulationSchematicViewer, {
      circuitJson: [],
      buttons: [{ component_name: "SW1", is_pressed: false }],
      leds: [{ component_name: "LED1", is_on: true }],
      isPowered: true,
    }),
  )

  expect(markup).toContain("Firmware board inputs and outputs")
  expect(markup).toContain("Press and hold")
  expect(markup).toContain("LED1 on")
})
