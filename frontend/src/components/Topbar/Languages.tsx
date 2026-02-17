import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { langData } from './data/langData'
import { useTranslation } from 'react-i18next'

const Languages = () => {
  const { i18n } = useTranslation();

  const lang =  langData.find(lan => lan.id == (localStorage.getItem("language") || i18n.language)) || langData[0]
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen)
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    toggleDropDown()
    localStorage.setItem("language", lng)
    location.reload()
  };

  return (
    <div>
      <Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
        <Dropdown.Toggle
          className="arrow-none header-btn"
          as="a"
          role="button"
          onClick={toggleDropDown}
        >
          <img
            src={lang.flag}
            alt="flag"
            width={20}
            className="rounded-circle"
          />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          {langData.map(({ flag, name, id }, idx) => (
            <Link to="#" className="dropdown-item" key={idx + '-lang'} onClick={() => changeLanguage(id)}>
              <img
                src={flag}
                alt={name}
                width={20}
                className="img-fluid rounded-circle me-3"
              />
              <span className="align-middle">{name}</span>
            </Link>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default Languages
