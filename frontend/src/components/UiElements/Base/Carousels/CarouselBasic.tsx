import { Carousel, Image } from 'react-bootstrap'
import carouselItems from './data/carouseData'

const CarouselBasic = () => {
  return (
    <div>
      <Carousel interval={null}>
        {carouselItems.map(({ src, alt }, index) => (
          <Carousel.Item key={index}>
            <Image src={src} alt={alt} fluid />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default CarouselBasic
