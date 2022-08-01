import * as Type from "lib/types"
import SVGPathComponent from "./SVGPathComponent"

interface Props {
  component: {
    source: Type.SourceTrace
    schematic: Type.SchematicTrace
  }
}

export const SchematicTrace = ({ component: { source, schematic } }: Props) => {
  // return (
  //   <SVGPathComponent
  //     rotation={schematic.rotation}
  //     center={schematic.center}
  //     size={schematic.size}
  //     paths={[
  //       {
  //         stroke: "red",
  //         strokeWidth: 1,
  //         d: "M 0 15 l 10 0 l 0 -6 l 20 0 l 0 12 l -20 0 l 0 -6 m 20 0 l 10 0",
  //       },
  //     ]}
  //   />
  // )
  return null
}

export default SchematicTrace
