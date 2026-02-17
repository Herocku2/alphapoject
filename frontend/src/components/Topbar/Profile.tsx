import { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useGetUserQuery } from '../../store/api/auth/authApiSlice'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)
  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen)
  }

  const {data: user} = useGetUserQuery()

  const {t} = useTranslation()


  function logout(){
    localStorage.clear()
    location.href=  "/"
  }

  return (
    <div>
      <Dropdown show={dropDownOpen} onToggle={toggleDropDown}>
        <Dropdown.Toggle
          className="arrow-none header-btn px-2"
          as="a"
          role="button"
          onClick={toggleDropDown}
        >
          {/* <Avatar type="image" src={user?.avatar || ""} size="md"> */}
           <img style={{maxWidth: "40px", maxHeight: "40px"}} src={user?.avatar || ""} />
          {/* </Avatar> */}
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className="dropdown-md px-0 py-0">
          <div className="px-4 py-3 d-flex border-bottom">
            {/* <Avatar type="image" src={user?.avatar || ""} size="md"
             shape="2" className="" /> */}
             <img style={{maxWidth: "50px", maxHeight: "50px"}} src={user?.avatar || ""} />
            <div className="flex-grow-1 ms-3">
              <h6 className="text-dark mb-0">{user?.first_name} {user?.last_name}</h6>
              {/* <span>{user?.email}</span> */}
            </div>
          </div>
       
          {/* <div className="dropdown-divider"></div> */}
          <div className="px-2 pb-2">
              <a className="dropdown-item text-danger "  onClick={logout}>
                <i className={"fi fi-rr-sign-out-alt"}></i>
                <span className="ms-3">{t("Logout")}</span>
              </a>
          </div>
        </Dropdown.Menu>
      </Dropdown>
     
    </div>
  )
}

export default Profile
