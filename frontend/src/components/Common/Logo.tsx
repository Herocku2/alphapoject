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
          {/* Icono SVG a la izquierda */}
          <div style={{ flexShrink: 0 }}>
            <svg
              width="80"
              height="60"
              viewBox="0 0 100 80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Forma de S estilizada similar al logo original */}
              <path
                d="M20,15 Q10,15 10,25 Q10,35 20,35 L60,35 Q70,35 70,45 Q70,55 60,55 L30,55"
                stroke="#FFA500"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M30,55 L20,55 Q10,55 10,65 Q10,75 20,75 L60,75 Q70,75 70,65"
                stroke="#FFA500"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Texto a la derecha - color claro para modo oscuro */}
          <div style={{
            fontSize: "48px",
            fontWeight: "bold",
            fontStyle: "italic",
            color: "#79c0ff",
            fontFamily: "Arial, sans-serif",
            whiteSpace: "nowrap"
          }}>
            Alpha Sentinel
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logo
