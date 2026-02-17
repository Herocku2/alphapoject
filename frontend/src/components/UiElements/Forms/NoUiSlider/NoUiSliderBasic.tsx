import Nouislider from 'nouislider-react'
import 'nouislider/distribute/nouislider.css'

const NoUiSliderBasic = () => {
  return (
    <div>
      <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect />
    </div>
  )
}

export default NoUiSliderBasic
