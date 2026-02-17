import { Carousel, Image } from 'react-bootstrap'
import carouselItems from './data/carouseData'

const CarouseAutoplay = () => {
  return (
    <div>
      <Carousel>
        {carouselItems.map(({ src, alt, caption, text }, index) => (
          <Carousel.Item key={index} interval={1200}>
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

export default CarouseAutoplay
