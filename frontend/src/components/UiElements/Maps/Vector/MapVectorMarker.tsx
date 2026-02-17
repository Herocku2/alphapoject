import MapBase from './MapBase'
import { mapOptsMarker } from './data'
import 'jsvectormap/dist/js/jsvectormap.min.js'
import 'jsvectormap/dist/maps/world.js'
import 'jsvectormap/dist/css/jsvectormap.min.css'

interface MapVectorMarkerProps {
  width?: string
  height?: string
  options?: any
}

const MapVectorMarker = ({ width, height }: MapVectorMarkerProps) => {
  return (
    <div>
      <MapBase type="world" width={width} height={height} options={mapOptsMarker} />
    </div>
  )
}

export default MapVectorMarker
