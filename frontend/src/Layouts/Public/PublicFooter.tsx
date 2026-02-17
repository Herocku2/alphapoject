import Copyright from '@/components/Misc/Copyright'
import { Container, } from 'react-bootstrap'

const PublicFooter = () => {
  return (
    <footer
      className="footer-public bg-body-tertiary hstack border-top"
      style={{ minHeight: '4rem' }}>
      <Container className="d-flex align-items-center">
        <Copyright />

      </Container>
    </footer>
  )
}

export default PublicFooter
