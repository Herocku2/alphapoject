import Nouislider from 'nouislider-react'
import 'nouislider/distribute/nouislider.css'

const NoUiSliderPips = () => {
  return (
    <div>
      <Nouislider
        start={[50]}
        pips={{ mode: 'count', values: 5 }}
        clickablePips
        range={{
          min: 0,
          max: 100,
        }}
      />
    </div>
  )
}

export default NoUiSliderPips
