import { Carousel, Image } from 'react-bootstrap'
import carouselItems from './data/carouseData'

const CarouseCrossfade = () => {
  return (
    <div>
      <Carousel fade interval={null}>
        {carouselItems.map(({ src, alt, caption, text }, index) => (
          <Carousel.Item key={index}>
            <Image src={src} alt={alt} fluid />
            <Carousel.Caption>
              <h3 className="text-light">{caption}</h3>
              <p>{text}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}

export default CarouseCrossfade
