import 'jsvectormap/dist/js/jsvectormap.min.js'
import 'jsvectormap/dist/maps/world.js'
import 'jsvectormap/dist/css/jsvectormap.min.css'

import MapBase from './MapBase'

import { mapOptsBasic } from './data'

interface MapVectorBasicProps {
  width?: string
  height?: string
  options?: any
}

const MapVectorBasic = ({ width, height }: MapVectorBasicProps) => {
  return (
    <div>
      <MapBase type="world" width={width} height={height} options={mapOptsBasic} />
    </div>
  )
}

export default MapVectorBasic
