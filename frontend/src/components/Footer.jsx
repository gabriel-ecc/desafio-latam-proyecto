// Pie de página.
import { Link } from "react-router-dom"
import "./Footer.css"

const Footer = () => {
  return (
    <footer>
      {/* NOTA: Para que este footer se vea bien, necesitarás crear un archivo CSS
          (ej. Footer.css) con los estilos correspondientes y luego importarlo aquí. */}
      <div className="row justify-content-center mb-0 pt-5 pb-4 row-2">
        <div className="col-lg-10 col-12 px-3">
          <div className="row row-2 align-items-start gy-4">
            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
              <img
                src="../../public/imgs/logo-ejemplo.jpeg"
                alt="Logo La Gata De Campo"
                className="logo-image"
              />
              <b className="mt-2">La Gata De Campo</b>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <ul className="list-unstyled">
                <li>
                  <Link to="/">
                    <strong>
                      <i className="fa-solid fa-sm fa-arrow-right"></i> Volver a
                      inicio
                    </strong>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <strong>
                      <i className="fa-solid fa-sm fa-arrow-right"></i> Sobre
                      nosotros
                    </strong>
                  </Link>
                </li>
                <li className="mt-3">
                  <strong>Métodos de pago:</strong>
                </li>
                <li>
                  <i className="fa-solid fa-credit-card"></i>
                  <i className="fa-solid fa-money-bill-wave ms-2"></i>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <ul className="list-unstyled">
                <li>
                  <strong>Localización:</strong>
                </li>
                <li>
                  Av. Sta. Rosa 2238, 8361351 Santiago, Región Metropolitana
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <ul className="list-unstyled">
                <li>
                  <strong>Contáctanos:</strong>
                </li>
                <li>
                  <a
                    href="https://wa.me/56912345678"
                    className="enlace-contacto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-whatsapp"></i> +56 9 1234 5678
                  </a>
                </li>
                <li>
                  <a href="tel:6004006000" className="enlace-contacto">
                    <i className="fa-solid fa-phone"></i> 600 400 6000
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:gatadecampo@gmail.com"
                    className="enlace-contacto"
                  >
                    <i className="fa-solid fa-envelope"></i>
                    gatadecampo@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-0 pt-0 row-1 mb-0">
        <div className="col-12 px-sm-3 px-2">
          <div className="row my-4 row-1 no-gutters">
            <div className="col-12 text-center">
              <small>Copyright © 2025 Verdurería - La Gata De Campo</small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
