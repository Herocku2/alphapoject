const Logo = ({ url = "" }: { url: string }) => {
  // Si se proporciona URL, usar la imagen
  if (url) {
    return (
      <div>
        <div className="row mt-4 mx-auto">
          <img src={url} className="" style={{ maxWidth: "420px" }} />
        </div>
      </div>
    )
  }

  // Logo por defecto con el estilo original: icono a la izquierda, texto a la derecha
  return (
    <div>
      <div className="row mt-4 mx-auto" style={{ maxWidth: "420px" }}>
        <div className="d-flex align-items-center gap-2">
          <img src="/images/alpha-logo.png" alt="Alpha Sentinel Logo" style={{ maxWidth: '200px', height: 'auto' }} />
        </div>
      </div>
    </div>
  )
}

export default Logo
