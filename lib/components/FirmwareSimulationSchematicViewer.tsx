import type { CircuitJson } from "circuit-json"
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react"
import { SchematicViewer } from "./SchematicViewer"

export interface FirmwareSchematicButtonState {
  component_name: string
  is_pressed: boolean
}

export interface FirmwareSchematicLedState {
  component_name: string
  is_on: boolean
}

export interface FirmwareSimulationSchematicViewerProps {
  circuitJson: CircuitJson
  buttons: FirmwareSchematicButtonState[]
  leds: FirmwareSchematicLedState[]
  isPowered: boolean
  onButtonChange?: (request: {
    component_name: string
    is_pressed: boolean
  }) => void
  containerStyle?: CSSProperties
  schematicCss?: string
  className?: string
}

const benchOverlayStyle: CSSProperties = {
  position: "absolute",
  left: 16,
  bottom: 16,
  display: "flex",
  alignItems: "stretch",
  gap: 8,
  maxWidth: "calc(100% - 32px)",
  padding: 8,
  border: "1px solid #cbd5e1",
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  overflowX: "auto",
  zIndex: 10,
}

const buttonStyle = (isPressed: boolean): CSSProperties => ({
  minWidth: 112,
  padding: "8px 12px",
  border: `1px solid ${isPressed ? "#2563eb" : "#cbd5e1"}`,
  borderRadius: 8,
  background: isPressed ? "#dbeafe" : "#ffffff",
  color: "#0f172a",
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "left",
  userSelect: "none",
})

const setFirmwareButtonPressed = (request: {
  componentName: string
  isPressed: boolean
  onButtonChange?: FirmwareSimulationSchematicViewerProps["onButtonChange"]
}) => {
  request.onButtonChange?.({
    component_name: request.componentName,
    is_pressed: request.isPressed,
  })
}

const releaseFirmwareButtonPointer = (request: {
  event: PointerEvent<HTMLButtonElement>
  componentName: string
  onButtonChange?: FirmwareSimulationSchematicViewerProps["onButtonChange"]
}) => {
  if (request.event.currentTarget.hasPointerCapture(request.event.pointerId)) {
    request.event.currentTarget.releasePointerCapture(request.event.pointerId)
  }
  setFirmwareButtonPressed({
    componentName: request.componentName,
    isPressed: false,
    onButtonChange: request.onButtonChange,
  })
}

const changeFirmwareButtonFromKeyboard = (request: {
  event: KeyboardEvent<HTMLButtonElement>
  componentName: string
  isPressed: boolean
  onButtonChange?: FirmwareSimulationSchematicViewerProps["onButtonChange"]
}) => {
  if (request.event.key !== " " && request.event.key !== "Enter") return
  request.event.preventDefault()
  if (request.event.repeat && request.isPressed) return
  setFirmwareButtonPressed({
    componentName: request.componentName,
    isPressed: request.isPressed,
    onButtonChange: request.onButtonChange,
  })
}

const MomentaryFirmwareButton = (request: {
  button: FirmwareSchematicButtonState
  onButtonChange?: FirmwareSimulationSchematicViewerProps["onButtonChange"]
}) => (
  <button
    type="button"
    aria-pressed={request.button.is_pressed}
    style={buttonStyle(request.button.is_pressed)}
    onPointerDown={(event) => {
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      setFirmwareButtonPressed({
        componentName: request.button.component_name,
        isPressed: true,
        onButtonChange: request.onButtonChange,
      })
    }}
    onPointerUp={(event) =>
      releaseFirmwareButtonPointer({
        event,
        componentName: request.button.component_name,
        onButtonChange: request.onButtonChange,
      })
    }
    onPointerCancel={(event) =>
      releaseFirmwareButtonPointer({
        event,
        componentName: request.button.component_name,
        onButtonChange: request.onButtonChange,
      })
    }
    onKeyDown={(event) =>
      changeFirmwareButtonFromKeyboard({
        event,
        componentName: request.button.component_name,
        isPressed: true,
        onButtonChange: request.onButtonChange,
      })
    }
    onKeyUp={(event) =>
      changeFirmwareButtonFromKeyboard({
        event,
        componentName: request.button.component_name,
        isPressed: false,
        onButtonChange: request.onButtonChange,
      })
    }
    onBlur={() =>
      setFirmwareButtonPressed({
        componentName: request.button.component_name,
        isPressed: false,
        onButtonChange: request.onButtonChange,
      })
    }
  >
    <span style={{ display: "block", fontSize: 12, fontWeight: 700 }}>
      {request.button.component_name}
    </span>
    <span style={{ display: "block", marginTop: 2, fontSize: 10 }}>
      {request.button.is_pressed ? "Pressed" : "Press and hold"}
    </span>
  </button>
)

const FirmwareLedIndicator = (request: {
  led: FirmwareSchematicLedState
  isPowered: boolean
}) => {
  const isOn = request.isPowered && request.led.is_on
  return (
    <div
      style={{
        display: "flex",
        minWidth: 96,
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: 8,
        background: "#ffffff",
      }}
    >
      <span
        aria-label={`${request.led.component_name} ${isOn ? "on" : "off"}`}
        style={{
          width: 14,
          height: 14,
          flex: "0 0 auto",
          border: `1px solid ${isOn ? "#6ee7b7" : "#cbd5e1"}`,
          borderRadius: "50%",
          background: isOn ? "#10b981" : "#e2e8f0",
          boxShadow: isOn ? "0 0 12px rgba(16, 185, 129, 0.8)" : "none",
        }}
      />
      <span style={{ color: "#334155", fontSize: 11, fontWeight: 600 }}>
        {request.led.component_name}
      </span>
    </div>
  )
}

export const FirmwareSimulationSchematicViewer = ({
  circuitJson,
  buttons,
  leds,
  isPowered,
  onButtonChange,
  containerStyle,
  schematicCss,
  className,
}: FirmwareSimulationSchematicViewerProps) => (
  <div
    className={className}
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      minHeight: 300,
      ...containerStyle,
    }}
  >
    <SchematicViewer
      circuitJson={circuitJson}
      containerStyle={{ width: "100%", height: "100%" }}
      css={schematicCss}
    />
    {(buttons.length > 0 || leds.length > 0) && (
      <div
        aria-label="Firmware board inputs and outputs"
        style={benchOverlayStyle}
      >
        {buttons.map((button) => (
          <MomentaryFirmwareButton
            key={button.component_name}
            button={button}
            onButtonChange={onButtonChange}
          />
        ))}
        {leds.map((led) => (
          <FirmwareLedIndicator
            key={led.component_name}
            led={led}
            isPowered={isPowered}
          />
        ))}
      </div>
    )}
  </div>
)
