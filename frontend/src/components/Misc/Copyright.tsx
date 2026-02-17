import { Stack } from 'react-bootstrap'

const Copyright = () => {
  return (
    <div>
      <Stack direction="horizontal" style={{ lineHeight: 'normal' }}>
        <div className="text-muted">
          <span className="fs-12 fw-medium text-uppercase">Copyright&copy;</span>
          <span className="ms-1">{new Date().getFullYear()}</span>
        </div>
        <span className="vr mx-2 bg-secondary bg-opacity-25"></span>
     
      </Stack>
    </div>
  )
}

export default Copyright
